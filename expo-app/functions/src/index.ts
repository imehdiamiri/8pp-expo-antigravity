/**
 * Cloud Functions for PlayVirals
 *
 * 1. searchUsers      — Indexed user search (replaces client-side full-table scan)
 * 2. onUserCreate     — Auto-creates wallet + default profile data
 * 3. cleanupStaleRooms — Scheduled hourly room cleanup
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { beforeUserCreated } from "firebase-functions/v2/identity";
import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";

admin.initializeApp();

const db = admin.database();

// ─── searchUsers ────────────────────────────────────────────────────────
// Callable function for efficient server-side user search.
// The client sends a query string; the function searches by username prefix
// using RTDB's orderByChild + startAt/endAt for indexed O(log n) lookups.

export const searchUsers = onCall(async (request) => {
  // Verify caller is authenticated
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Must be signed in to search users."
    );
  }

  const query = (request.data?.query || "").trim().toLowerCase();
  const currentUserId = request.auth.uid;

  if (!query || query.length < 2) {
    return { results: [] };
  }

  try {
    // Use indexed prefix search on the 'username' field
    // RTDB indexes are defined in firebase-rtdb-rules.json under users.$uid.indexOn
    const snapshot = await db
      .ref("users")
      .orderByChild("username")
      .startAt(query)
      .endAt(query + "\uf8ff")
      .limitToFirst(20)
      .once("value");

    if (!snapshot.exists()) {
      return { results: [] };
    }

    const results: Array<{
      id: string;
      username: string;
      email?: string;
      avatarURL?: string;
    }> = [];

    snapshot.forEach((child) => {
      const uid = child.key!;
      if (uid === currentUserId) return; // skip self

      const data = child.val();
      results.push({
        id: uid,
        username: data.username || data.displayName || "",
        email: data.email || undefined,
        avatarURL: data.avatarURL || undefined,
      });
    });

    return { results };
  } catch (error: any) {
    console.error("searchUsers error:", error);
    throw new HttpsError("internal", "Search failed.");
  }
});

// ─── onUserCreate ───────────────────────────────────────────────────────
// When a new Firebase Auth user is created, initialize their RTDB profile
// with a default wallet and timestamps. This ensures every user has a
// consistent data structure from the start.

export const initializeUserProfile = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be signed in.");
  }

  const uid = request.auth.uid;
  const existingProfile = await db.ref(`users/${uid}`).once("value");

  // Only initialize if wallet doesn't exist yet (avoid overwriting)
  if (existingProfile.exists() && existingProfile.child("wallet").exists()) {
    return { status: "already_initialized" };
  }

  const profileData: Record<string, any> = {
    wallet: {
      balance: 50, // Welcome bonus
      lastDailyClaim: null,
      updatedAt: admin.database.ServerValue.TIMESTAMP,
    },
    inviteStats: {
      totalInvites: 0,
      starsEarned: 0,
    },
    createdAt: admin.database.ServerValue.TIMESTAMP,
    updatedAt: admin.database.ServerValue.TIMESTAMP,
  };

  try {
    await db.ref(`users/${uid}`).update(profileData);
    console.log(`Initialized profile for user ${uid}`);
    return { status: "initialized", balance: 50 };
  } catch (error) {
    console.error(`Failed to initialize profile for ${uid}:`, error);
    throw new HttpsError("internal", "Profile initialization failed.");
  }
});

// ─── cleanupStaleRooms ──────────────────────────────────────────────────
// Scheduled function that runs every hour to clean up rooms that have been
// in "waiting" status for more than 30 minutes (host probably disconnected
// without the onDisconnect handler firing).

export const cleanupStaleRooms = onSchedule("every 60 minutes", async () => {
  const cutoff = Date.now() - 30 * 60 * 1000; // 30 minutes ago

  try {
    const snapshot = await db
      .ref("rooms")
      .orderByChild("createdAt")
      .endAt(cutoff)
      .once("value");

    if (!snapshot.exists()) return;

    const updates: Record<string, null> = {};
    snapshot.forEach((child) => {
      const room = child.val();
      if (room.status === "waiting") {
        updates[`rooms/${child.key}`] = null;
      }
    });

    if (Object.keys(updates).length > 0) {
      await db.ref().update(updates);
      console.log(`Cleaned up ${Object.keys(updates).length} stale rooms`);
    }
  } catch (error) {
    console.error("Room cleanup error:", error);
  }
});

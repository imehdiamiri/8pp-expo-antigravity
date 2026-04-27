const functions = require("firebase-functions");
const admin = require("firebase-admin");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const fs = require("fs");
const path = require("path");
const os = require("os");

admin.initializeApp();
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

exports.reverseAudio = functions.https.onCall(async (data, context) => {
  // We expect data.audioBase64 (the recorded audio as base64)
  if (!data || !data.audioBase64) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing audioBase64 string."
    );
  }

  const base64Audio = data.audioBase64;
  const audioBuffer = Buffer.from(base64Audio, "base64");

  // Create temporary files
  const tempInputPath = path.join(os.tmpdir(), `input_${Date.now()}.m4a`);
  const tempOutputPath = path.join(os.tmpdir(), `output_${Date.now()}.m4a`);

  try {
    fs.writeFileSync(tempInputPath, audioBuffer);

    // Run ffmpeg to reverse the audio
    await new Promise((resolve, reject) => {
      ffmpeg(tempInputPath)
        .audioFilters("areverse") // The magic filter to reverse audio
        .output(tempOutputPath)
        .on("end", resolve)
        .on("error", (err) => {
          console.error("FFmpeg Error:", err);
          reject(err);
        })
        .run();
    });

    // Read the output and encode it back to base64
    const reversedBuffer = fs.readFileSync(tempOutputPath);
    const reversedBase64 = reversedBuffer.toString("base64");

    return {
      success: true,
      audioBase64: reversedBase64,
    };
  } catch (err) {
    console.error("Audio processing failed", err);
    throw new functions.https.HttpsError("internal", "Audio processing failed.");
  } finally {
    // Cleanup temporary files
    if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
    if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
  }
});

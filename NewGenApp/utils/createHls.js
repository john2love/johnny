const ffmpeg = require('ffmpeg-static');
const { execa } = require('execa');
const path = require('path');
const fs = require('fs');

module.exports = async function convertToHLS(inputPath, outputFolder) {
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const playlistPath = path.join(outputFolder, "index.m3u8");

  try {
    await execa(
      ffmpeg, 
      [
        "-i", inputPath,
        "-profile:v", "baseline",
        "-level", "3.0",
        "-start_number", "0",
        "-hls_time", "10",
        "-hls_list_size", "0",
        "-f", "hls",
        playlistPath
      ],
      { stdio: "inherit" }
    );

    console.log("🎉 HLS conversion completed:", playlistPath);
    return playlistPath;

  } catch (err) {
    console.error("❌ HLS conversion failed:", err);
    throw err;
  }
};

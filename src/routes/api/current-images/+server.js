// src/routes/api/images.js
import fs from 'fs/promises'; // Use the promise-based version of 'fs'.
import { join } from 'path';

export async function GET() {
  const imageDirectory = 'static/img'; // Set your base image directory

  async function getImagesInDirectory(directory) {
    const dirImages = [];

    try {
      const files = await fs.readdir(directory); // Use await to ensure async completion.

      for (const file of files) {
        const regex = /(\d+)(?:-(\d+))?\.(\w+)$/;
        const match = file.match(regex);

        if (match) {
          const id = match[1];
          const duration = match[2] ? parseInt(match[2], 10) : 10;

          const data = await fs.readFile(join(directory, file)); // Use await for reading the file.

          // Convert the image data to a base64-encoded string.
          const base64Image = Buffer.from(data).toString('base64');

          dirImages.push({
            img: base64Image, // No need to stringify base64Image as it's already a string.
            order: id,
            duration: duration,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }

    return dirImages;
  }

  const general = []

  general.push(...await getImagesInDirectory(join(imageDirectory, 'general')));

  const images = [];

  images.push(...await getImagesInDirectory(join(imageDirectory, 'default'))); // Use await here.

  const dateFolder = new Date().toISOString().split('T')[0];
  images.push(...await getImagesInDirectory(join(imageDirectory, dateFolder))); // Use await here.

  // Return a response with the array of images
  return new Response(JSON.stringify({
        "general": general,
        "gallery": images
      })
  );
}

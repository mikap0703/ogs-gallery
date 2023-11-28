// src/routes/api/images.js
import fs from 'fs/promises'; // Use the promise-based version of 'fs'.
import { join } from 'path';

export async function POST(request) {
  const requestData = await request.request.json()

  const imageDirectory = 'static/img'; // Set your base image directory

  async function getImagesInDirectory(directory) {
    const dirImages = [];
    let files = []

    try {
      files = await fs.readdir(directory);
    } catch (error) {
      return []
    }
    try {

      for (const file of files) {
        const regex = /(\d+)(?:-(\d+))?\.(\w+)$/;
        const match = file.match(regex);

        if (match) {
          const id = match[1];
          const duration = match[2] ? parseInt(match[2], 10) : 10;

          const data = await fs.readFile(join(directory, file)); // Use await for reading the file.


          // Determine the image type based on the file extension
          const ext = match[3];
          let imageType = '';
          if (ext === 'png') {
            imageType = 'image/png';
          } else if (ext === 'jpeg' || ext === 'jpg') {
            imageType = 'image/jpeg';
          } else if (ext === 'gif') {
            imageType = 'image/gif';
          } else if (ext === 'bmp') {
            imageType = 'image/bmp';
          } else if (ext === 'webp') {
            imageType = 'image/webp';
          } else {
            // Add conditions for other image types here
            // For example, you can add support for 'svg', 'tiff', etc.
          }

          // Convert the image data to a base64-encoded string with the appropriate data URI
          const base64Image = `data:${imageType};base64, ${Buffer.from(data).toString('base64')}`

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

  const formattedDate = requestData.date
  // possible exploit
  images.push(...await getImagesInDirectory(join(imageDirectory, formattedDate))); // Use await here.

  // Return a response with the array of images
  return new Response(JSON.stringify({
        "general": general,
        "gallery": images
      })
  );
}

/**
 * Reusable image processing utility.
 *
 * Accepts any image file (any size, resolution, aspect ratio, or quality)
 * and produces a compact, display-ready Base64 data URL suitable for
 * storing directly in a Firestore document.
 *
 * The image is downscaled to fit within MAX_DIMENSION on its longest side,
 * then encoded as WebP (falling back to JPEG when WebP isn't supported).
 * Quality is stepped down automatically until the result fits under
 * MAX_OUTPUT_BYTES, keeping individual Firestore documents small.
 */

const MAX_DIMENSION = 1280;
const MAX_OUTPUT_BYTES = 350_000; // ~350 KB, safely under Firestore's 1 MiB field limit
const QUALITY_STEPS = [0.82, 0.7, 0.6, 0.5, 0.4, 0.3];

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to read image file."));
    };
    img.src = url;
  });
}

function canvasToDataUrl(canvas: HTMLCanvasElement, type: string, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image encoding failed."));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read encoded image."));
        reader.readAsDataURL(blob);
      },
      type,
      quality
    );
  });
}

function dataUrlSizeBytes(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Math.ceil((base64.length * 3) / 4);
}

async function supportsWebp(): Promise<boolean> {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const dataUrl = canvas.toDataURL("image/webp");
  return dataUrl.startsWith("data:image/webp");
}

/**
 * Resize, compress, and convert an image file to a Base64 data URL ready
 * for Firestore storage. Automatically downscales large images and steps
 * down quality until the output is reasonably small.
 */
export async function processImageToBase64(file: File): Promise<string> {
  const img = await loadImage(file);

  let { width, height } = img;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    if (width >= height) {
      height = Math.round((height / width) * MAX_DIMENSION);
      width = MAX_DIMENSION;
    } else {
      width = Math.round((width / height) * MAX_DIMENSION);
      height = MAX_DIMENSION;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  const mimeType = (await supportsWebp()) ? "image/webp" : "image/jpeg";

  let result = await canvasToDataUrl(canvas, mimeType, QUALITY_STEPS[0]);
  for (let i = 1; i < QUALITY_STEPS.length && dataUrlSizeBytes(result) > MAX_OUTPUT_BYTES; i++) {
    result = await canvasToDataUrl(canvas, mimeType, QUALITY_STEPS[i]);
  }

  // If still too large even at the lowest quality, shrink dimensions further.
  while (dataUrlSizeBytes(result) > MAX_OUTPUT_BYTES && (canvas.width > 320 || canvas.height > 320)) {
    canvas.width = Math.round(canvas.width * 0.8);
    canvas.height = Math.round(canvas.height * 0.8);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    result = await canvasToDataUrl(canvas, mimeType, QUALITY_STEPS[QUALITY_STEPS.length - 1]);
  }

  return result;
}

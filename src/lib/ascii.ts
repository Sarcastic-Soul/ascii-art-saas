// lib/ascii.ts
import sharp from "sharp";

export async function uploadImageAndConvertToAscii(
    buffer: Buffer,
    width?: number,
    chars: string = "@%#*+=-:. ",
    height?: number,
    maintainOriginalSize: boolean = true,
    sizeMultiplier: number = 1.0
): Promise<string> {
    // Get original image metadata first
    const metadata = await sharp(buffer).metadata();
    const originalWidth = metadata.width || 100;
    const originalHeight = metadata.height || 100;

    // Character aspect ratio compensation - typical monospace chars are ~1.8-2x taller than wide
    const characterAspectRatio = 0.55; // This gives better results than 0.5

    let targetWidth = width;
    let targetHeight = height;

    if (maintainOriginalSize && !width && !height) {
        // Calculate base dimensions maintaining aspect ratio
        const baseMaxWidth = 120; // Base size before multiplier
        const scaledMaxWidth = Math.round(baseMaxWidth * sizeMultiplier);
        const imageAspectRatio = originalHeight / originalWidth;

        if (originalWidth > scaledMaxWidth) {
            targetWidth = scaledMaxWidth;
            // Apply character aspect ratio compensation to height
            targetHeight = Math.round(scaledMaxWidth * imageAspectRatio * characterAspectRatio);
        } else {
            // For smaller images, scale them up or down based on sizeMultiplier
            targetWidth = Math.round(originalWidth * sizeMultiplier);
            targetHeight = Math.round(originalHeight * sizeMultiplier * characterAspectRatio);
        }

        // Ensure minimum and maximum bounds
        targetWidth = Math.max(20, Math.min(300, targetWidth));
        targetHeight = Math.max(10, Math.min(200, targetHeight));
    } else if (!targetWidth) {
        targetWidth = 100; // fallback default
    }

    const resizeOptions: { width: number; height?: number } = { width: targetWidth };
    if (targetHeight && targetHeight > 0) {
        resizeOptions.height = targetHeight;
    }

    const { data, info } = await sharp(buffer)
        .resize(resizeOptions)
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const { height: actualHeight, width: actualWidth, channels } = info;
    let ascii = "";

    for (let y = 0; y < actualHeight; y++) {
        for (let x = 0; x < actualWidth; x++) {
            const idxPixel = (y * actualWidth + x) * channels;
            const r = data[idxPixel];
            const charIdx = Math.floor((r / 255) * (chars.length - 1));
            ascii += chars[charIdx];
        }
        ascii += "\n";
    }

    return ascii;
}

// Helper function to get image dimensions
export async function getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
    const metadata = await sharp(buffer).metadata();
    return {
        width: metadata.width || 0,
        height: metadata.height || 0
    };
}
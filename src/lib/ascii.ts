// lib/ascii.ts
import sharp from "sharp";

export async function uploadImageAndConvertToAscii(
    buffer: Buffer,
    width?: number,
    chars: string = "@%#*+=-:. ",
    height?: number,
    maintainOriginalSize: boolean = true
): Promise<string> {
    // Get original image metadata first
    const metadata = await sharp(buffer).metadata();
    const originalWidth = metadata.width || 100;
    const originalHeight = metadata.height || 100;

    // If maintainOriginalSize is true and no custom dimensions provided, use original dimensions
    // But scale them down proportionally to keep reasonable ASCII size (max 150 chars wide)
    let targetWidth = width;
    let targetHeight = height;

    if (maintainOriginalSize && !width && !height) {
        const maxWidth = 150; // Maximum ASCII width for readability
        const aspectRatio = originalHeight / originalWidth;

        if (originalWidth > maxWidth) {
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * aspectRatio * 0.5); // 0.5 to account for character aspect ratio
        } else {
            targetWidth = originalWidth;
            targetHeight = Math.round(originalHeight * 0.5); // 0.5 to account for character aspect ratio
        }
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
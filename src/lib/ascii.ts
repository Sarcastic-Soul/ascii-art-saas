// lib/ascii.ts
import sharp from "sharp";
export async function uploadImageAndConvertToAscii(
    buffer: Buffer,
    width: number = 100,
    chars: string = "@%#*+=-:. "
): Promise<string> {
    const { data, info } = await sharp(buffer)
        .resize({ width })
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const { height, channels } = info;
    let ascii = "";

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idxPixel = (y * width + x) * channels;
            const r = data[idxPixel];
            const charIdx = Math.floor((r / 255) * (chars.length - 1));
            ascii += chars[charIdx];
        }
        ascii += "\n";
    }

    return ascii;
}

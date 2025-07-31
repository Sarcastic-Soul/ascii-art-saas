// lib/client-utils.ts
import { toast } from "sonner";

export function downloadTextFile(content: string, filename: string): void {
    // Remove HTML tags for plain text download
    const plainText = content.replace(/<[^>]*>/g, '');

    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Downloaded ${filename}`);
}

export function copyToClipboard(content: string): Promise<void> {
    // Remove HTML tags for plain text copy
    const plainText = content.replace(/<[^>]*>/g, '');
    return navigator.clipboard.writeText(plainText).then(() => {
        toast.success("Copied to clipboard!");
    }).catch(() => {
        toast.error("Failed to copy to clipboard");
        throw new Error("Copy failed");
    });
}

export function shareAsciiArt(content: string, title: string): void {
    const plainText = content.replace(/<[^>]*>/g, '');

    if (navigator.share) {
        navigator.share({
            title: `ASCII Art: ${title}`,
            text: plainText,
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        copyToClipboard(plainText).then(() => {
            alert('ASCII art copied to clipboard!');
        }).catch(() => {
            alert('Sharing not supported. ASCII art copied to clipboard!');
        });
    }
}

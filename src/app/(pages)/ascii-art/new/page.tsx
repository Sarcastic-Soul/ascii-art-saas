"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAsciiArtPage() {
    const router = useRouter();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageName, setImageName] = useState("");
    const [width, setWidth] = useState(100);
    const [chars, setChars] = useState("@%#*+=-:. ");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) setImageName(file.name.split(".")[0]);
    };

    const handleSubmit = async () => {
        if (!imageFile) return;

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("imageName", imageName);
        formData.append("width", width.toString());
        formData.append("chars", chars);

        setLoading(true);

        const res = await fetch("/api/ascii-art/upload", {
            method: "POST",
            body: formData,
        });

        setLoading(false);

        if (res.ok) {
            router.push("/dashboard");
        } else {
            alert("Upload failed.");
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto font-mono text-green-400 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-green-300">🆕 New ASCII Art</h1>

            <label
                className="block border-2 border-green-500 border-dashed rounded-md p-6 text-center mb-4 cursor-pointer hover:bg-green-900/20 transition"
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
                {imageFile ? (
                    <p>{imageFile.name}</p>
                ) : (
                    <p className="text-green-500">Click or drag an image to upload</p>
                )}
            </label>

            {imageFile && (
                <>
                    <input
                        type="text"
                        value={imageName}
                        onChange={(e) => setImageName(e.target.value)}
                        placeholder="Image name"
                        className="w-full px-4 py-2 mb-4 rounded bg-zinc-950 border border-green-500 text-green-400 placeholder-green-700"
                    />

                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block mb-1 text-sm text-green-500">Width</label>
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}
                                className="w-full px-3 py-1 rounded bg-zinc-950 border border-green-500 text-green-400"
                                min={10}
                                max={500}
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block mb-1 text-sm text-green-500">Characters</label>
                            <input
                                type="text"
                                value={chars}
                                onChange={(e) => setChars(e.target.value)}
                                className="w-full px-3 py-1 rounded bg-zinc-950 border border-green-500 text-green-400"
                            />
                        </div>
                    </div>
                </>
            )}

            <button
                onClick={handleSubmit}
                disabled={!imageFile || loading}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-black font-bold rounded disabled:opacity-40"
            >
                {loading ? "Generating ASCII..." : "💾 Convert & Save"}
            </button>
        </div>
    );
}

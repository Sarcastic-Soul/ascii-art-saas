"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Eye, Save, Sparkles } from "lucide-react";

export default function NewAsciiArtPage() {
    const router = useRouter();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageName, setImageName] = useState("");
    const [width, setWidth] = useState<number | undefined>(undefined);
    const [height, setHeight] = useState<number | undefined>(undefined);
    const [chars, setChars] = useState("@%#*+=-:. ");
    const [loading, setLoading] = useState(false);
    const [previewAscii, setPreviewAscii] = useState<string>("");
    const [showPreview, setShowPreview] = useState(false);
    const [maintainOriginalSize, setMaintainOriginalSize] = useState(true);
    const [originalDimensions, setOriginalDimensions] = useState<{ width: number, height: number } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) {
            setImageName(file.name.split(".")[0]);

            // Get original image dimensions
            const img = new Image();
            img.onload = () => {
                setOriginalDimensions({ width: img.width, height: img.height });
            };
            img.src = URL.createObjectURL(file);
        }
        setShowPreview(false);
        setPreviewAscii("");
    };

    const handlePreview = async () => {
        if (!imageFile) return;

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("imageName", imageName);
        if (width !== undefined) formData.append("width", width.toString());
        if (height !== undefined && height > 0) formData.append("height", height.toString());
        formData.append("chars", chars);
        formData.append("preview", "true");
        formData.append("maintainOriginalSize", maintainOriginalSize.toString());

        setLoading(true);

        try {
            const res = await fetch("/api/ascii-art/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setPreviewAscii(data.asciiText || "");
                setShowPreview(true);
            } else {
                const errorData = await res.json();
                alert(errorData.error || "Preview failed.");
            }
        } catch (error) {
            alert("Preview failed.");
        }

        setLoading(false);
    };

    const handleSubmit = async () => {
        if (!imageFile) return;

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("imageName", imageName);
        if (width !== undefined) formData.append("width", width.toString());
        if (height !== undefined && height > 0) formData.append("height", height.toString());
        formData.append("chars", chars);
        formData.append("maintainOriginalSize", maintainOriginalSize.toString());

        setLoading(true);

        const res = await fetch("/api/ascii-art/upload", {
            method: "POST",
            body: formData,
        });

        setLoading(false);

        if (res.ok) {
            router.push("/dashboard");
        } else {
            const errorData = await res.json();
            alert(errorData.error || "Upload failed.");
        }
    };

    return (
        <div className="p-6 w-full max-w-7xl mx-auto font-mono text-green-400 min-h-screen bg-black/95">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-green-300 flex items-center gap-3">
                    <Sparkles className="text-green-400" />
                    New ASCII Art
                </h1>
                <p className="text-green-500/80 mt-2">Transform your images into stunning ASCII art</p>
            </div>

            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
                {/* Left Panel - Controls */}
                <div className="w-full">
                    <label className="block border-2 border-green-500/50 border-dashed rounded-lg p-8 text-center mb-6 cursor-pointer hover:border-green-400 hover:bg-green-900/10 transition-all duration-300 bg-zinc-900/50 backdrop-blur-sm">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <Upload className="mx-auto mb-3 text-green-400" size={32} />
                        {imageFile ? (
                            <div>
                                <p className="text-green-300 font-semibold">{imageFile.name}</p>
                                <p className="text-green-500/60 text-sm mt-1">Click to change image</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-green-400 font-semibold">Upload your image</p>
                                <p className="text-green-500/60 text-sm mt-1">Click or drag an image file here</p>
                            </div>
                        )}
                    </label>

                    {imageFile && (
                        <div className="space-y-6">
                            <div className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-lg border border-green-500/30">
                                <h3 className="text-green-300 font-semibold mb-4 flex items-center gap-2">
                                    <Sparkles size={18} />
                                    Configuration
                                </h3>

                                <input
                                    type="text"
                                    value={imageName}
                                    onChange={(e) => setImageName(e.target.value)}
                                    placeholder="Enter ASCII art name"
                                    className="w-full px-4 py-3 mb-4 rounded-lg bg-black/50 border border-green-500/50 text-green-400 placeholder-green-700/50 focus:border-green-400 focus:outline-none transition-colors"
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block mb-2 text-sm text-green-400 font-medium">Width (chars)</label>
                                        <input
                                            type="number"
                                            value={width || ""}
                                            onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : undefined)}
                                            placeholder={maintainOriginalSize ? "Auto (original size)" : "100"}
                                            className="w-full px-3 py-2 rounded-lg bg-black/50 border border-green-500/50 text-green-400 placeholder-green-700/50 focus:border-green-400 focus:outline-none transition-colors"
                                            min={10}
                                            max={500}
                                            disabled={maintainOriginalSize}
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm text-green-400 font-medium">Height (chars)</label>
                                        <input
                                            type="number"
                                            value={height || ""}
                                            onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : undefined)}
                                            placeholder={maintainOriginalSize ? "Auto (original size)" : "Auto"}
                                            className="w-full px-3 py-2 rounded-lg bg-black/50 border border-green-500/50 text-green-400 placeholder-green-700/50 focus:border-green-400 focus:outline-none transition-colors"
                                            min={0}
                                            max={500}
                                            disabled={maintainOriginalSize}
                                        />
                                        <p className="text-xs text-green-500/60 mt-1">
                                            {maintainOriginalSize ? "Calculated from original image" : "0 = auto calculate"}
                                        </p>
                                    </div>
                                </div>

                                {/* Original Size Toggle */}
                                <div className="mb-4">
                                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-black/30 border border-green-500/30 hover:border-green-400/50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={maintainOriginalSize}
                                            onChange={(e) => setMaintainOriginalSize(e.target.checked)}
                                            className="w-4 h-4 text-green-600 bg-gray-800 border-green-500/50 rounded focus:ring-green-500 focus:ring-2"
                                        />
                                        <div className="flex-1">
                                            <span className="text-sm text-green-400 font-medium">
                                                Maintain original image proportions (Recommended)
                                            </span>
                                            {originalDimensions && (
                                                <p className="text-xs text-green-500/60 mt-1">
                                                    Original: {originalDimensions.width} × {originalDimensions.height} pixels
                                                </p>
                                            )}
                                        </div>
                                    </label>
                                    {!maintainOriginalSize && (
                                        <p className="text-xs text-yellow-500/80 mt-2 ml-3">
                                            ⚠️ Manual sizing may distort the image proportions
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-green-400 font-medium">Character Set</label>
                                    <input
                                        type="text"
                                        value={chars}
                                        onChange={(e) => setChars(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-green-500/50 text-green-400 focus:border-green-400 focus:outline-none transition-colors font-mono"
                                        placeholder="@%#*+=-:. "
                                    />
                                    <p className="text-xs text-green-500/60 mt-1">From dark to light intensity</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handlePreview}
                                    disabled={!imageFile || loading}
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                                >
                                    <Eye size={18} />
                                    {loading ? "Generating..." : "Preview"}
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!imageFile || loading}
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-black font-bold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/25"
                                >
                                    <Save size={18} />
                                    {loading ? "Saving..." : "Convert & Save"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - Preview */}
                {showPreview && previewAscii && (
                    <div className="w-full">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-green-300 flex items-center gap-2">
                                <Eye className="text-green-400" />
                                Preview
                            </h2>
                            <p className="text-sm text-green-500/80 mt-1">
                                This is how your ASCII art will look. Save it to access copy/download/share options.
                            </p>
                        </div>

                        <div className="bg-zinc-900/80 backdrop-blur-sm p-6 rounded-lg overflow-auto text-xs max-h-96 border border-green-500/50 w-full shadow-2xl shadow-green-500/10">
                            <pre className="whitespace-pre-wrap text-green-400 leading-tight">{previewAscii}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

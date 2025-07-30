"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { downloadTextFile, copyToClipboard, shareAsciiArt } from "@/lib/client-utils";
import { Copy, Download, Share2, Calendar, Loader2, AlertCircle } from "lucide-react";

interface AsciiArt {
  id: number;
  imageName: string;
  asciiText: string;
  createdAt: string;
}

export default function AsciiArtPage() {
  const params = useParams();
  const [art, setArt] = useState<AsciiArt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArt = async () => {
      try {
        const response = await fetch(`/api/ascii-art/${params.id}`);
        if (!response.ok) {
          throw new Error('ASCII art not found');
        }
        const data = await response.json();
        setArt(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArt();
    }
  }, [params.id]);

  const handleDownload = () => {
    if (art) {
      downloadTextFile(art.asciiText, `${art.imageName}_ascii.txt`);
    }
  };

  const handleCopy = async () => {
    if (art) {
      try {
        await copyToClipboard(art.asciiText);
        alert("ASCII art copied to clipboard!");
      } catch (error) {
        alert("Failed to copy to clipboard.");
      }
    }
  };

  const handleShare = () => {
    if (art) {
      shareAsciiArt(art.asciiText, art.imageName);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-black/95 font-mono">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex items-center gap-3 text-green-400">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-lg">Loading ASCII art...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !art) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-black/95 font-mono">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle size={24} />
            <span className="text-lg">Error: {error || 'ASCII art not found'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-black/95 font-mono text-green-400">
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-green-500/30 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-300 mb-2">{art.imageName}</h1>
            <div className="flex items-center gap-2 text-green-500/80">
              <Calendar size={16} />
              <span className="text-sm">
                {new Date(art.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-black text-sm font-bold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg shadow-yellow-500/25"
              title="Copy to clipboard"
            >
              <Copy size={16} />
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-bold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-500/25"
              title="Download as text file"
            >
              <Download size={16} />
              Download
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm font-bold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/25"
              title="Share ASCII art"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/80 backdrop-blur-sm p-6 rounded-lg overflow-x-auto border border-green-500/50 shadow-2xl shadow-green-500/10">
        <pre className="whitespace-pre-wrap text-green-400 leading-tight text-xs sm:text-sm">{art.asciiText}</pre>
      </div>
    </div>
  );
}

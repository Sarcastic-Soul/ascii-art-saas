"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, Loader2, AlertCircle, Copy, Globe } from "lucide-react";
import { copyToClipboard } from "@/lib/client-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

interface PublicAsciiArt {
  id: number;
  imageName: string;
  asciiText: string;
  createdAt: string;
}

export default function PublicAsciiArtPage() {
  const params = useParams();
  const [art, setArt] = useState<PublicAsciiArt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArt = async () => {
      try {
        const response = await fetch(`/api/public/ascii-art/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('ASCII art not found or not publicly shared');
          }
          throw new Error('Failed to load ASCII art');
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

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    if (art) {
      try {
        await copyToClipboard(art.asciiText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        // Error already handled by copyToClipboard
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-black/95 font-mono">
        <motion.div
          className="flex items-center justify-center min-h-[50vh]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 text-green-400">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-lg">Loading ASCII art...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !art) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-black/95 font-mono">
        <motion.div
          className="flex items-center justify-center min-h-[50vh]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle size={24} />
            <span className="text-lg">Error: {error || 'ASCII art not found'}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6 min-h-screen bg-black/95 font-mono text-green-400"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-zinc-900/50 backdrop-blur-sm border-green-500/30 mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <motion.h1
                className="text-2xl sm:text-3xl font-bold text-green-300 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {art.imageName}
              </motion.h1>
              <motion.div
                className="flex items-center gap-2 text-green-500/80 mb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Calendar size={16} />
                <span className="text-sm">
                  {new Date(art.createdAt).toLocaleString()}
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Badge variant="secondary" className="bg-green-900/50 text-green-400 border-green-500/50">
                  <Globe size={12} className="mr-1" />
                  Publicly Shared
                </Badge>
              </motion.div>
            </div>

            {/* Copy button */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                onClick={handleCopy}
                variant="outline"
                className="border-green-500/50 text-green-400 hover:bg-green-900/20 hover:border-green-400 font-mono"
                size="sm"
              >
                <Copy size={16} className="mr-2" />
                {copySuccess ? "Copied!" : "Copy"}
              </Button>
            </motion.div>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-zinc-900/80 backdrop-blur-sm border-green-500/50 shadow-2xl shadow-green-500/10">
        <CardContent>
          <motion.div
            className="overflow-x-auto overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <pre className="whitespace-pre text-green-400 leading-tight text-xs sm:text-sm">{art.asciiText}</pre>
          </motion.div>
        </CardContent>
      </Card>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-green-500/60 text-sm">
          Want to create your own ASCII art?
          <a href="/sign-up" className="text-green-400 hover:text-green-300 ml-1 underline">
            Sign up here!
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}

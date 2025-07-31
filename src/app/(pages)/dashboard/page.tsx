"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import React, { useCallback, useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { AsciiArtType } from "@/types/artType";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Search, LogOut, User, Sparkles, Grid3X3, Calendar, Globe, Lock } from "lucide-react";
import { deleteAsciiArt } from "@/actions/artAction";
import { motion } from "framer-motion";

function Dashboard() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();

    const [arts, setArts] = useState<AsciiArtType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [debouncedSearchTerm] = useDebounceValue(searchTerm, 500);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const totalPages = Math.ceil(totalCount / 6);

    const [userData, setUserData] = useState<{
        isSubscribed: boolean;
        dailyCreditsUsed: number;
    } | null>(null);

    const fetchUserData = async () => {
        const res = await fetch("/api/me");
        if (res.ok) {
            const data = await res.json();
            setUserData(data);
        }
    };

    const fetchArts = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        try {
            const response = await fetch(`/api/ascii-art?search=${debouncedSearchTerm}&page=${page}`);
            if (!response.ok) throw new Error("Failed to fetch arts");
            const data = await response.json();
            setArts(data.arts);
            setTotalCount(data.total);
        } catch (error) {
            console.error("Error fetching arts:", error);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, page, user]);

    useEffect(() => {
        fetchArts();
    }, [fetchArts]);

    useEffect(() => {
        if (user) fetchUserData();
    }, [user]);

    const handleLogout = async () => {
        await signOut();
        router.push("/");
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        await deleteAsciiArt(id);
        fetchArts(); // Refresh list
    };

    const remainingCredits = userData?.isSubscribed ? "∞" : Math.max(0, 5 - (userData?.dailyCreditsUsed || 0));

    return (
        <div className="p-6 max-w-6xl mx-auto relative min-h-screen bg-black/95 font-mono">
            <div className="absolute top-6 right-6 text-sm text-green-400">
                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-green-400 hover:text-green-300 hover:bg-green-900/20 px-3 py-2 text-sm flex items-center gap-2">
                                <User size={16} />
                                {user.primaryEmailAddress?.emailAddress}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-900 border-green-500/30">
                            <DropdownMenuItem disabled className="text-green-400">
                                <User size={16} className="mr-2" />
                                {user.primaryEmailAddress?.emailAddress}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                <LogOut size={16} className="mr-2" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            <div className="pt-16 mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-green-300 flex items-center gap-3">
                            <Grid3X3 className="text-green-400" />
                            Your ASCII Art Gallery
                        </h1>
                        <p className="text-green-500/80 mt-2">Manage and view your ASCII art creations</p>
                    </div>
                    <Button
                        onClick={() => router.push("/ascii-art/new")}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-black font-bold flex items-center gap-2 shadow-lg shadow-green-500/25"
                    >
                        <Plus size={18} />
                        Create New
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    {userData?.isSubscribed ? (
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none">
                            <Sparkles size={14} className="mr-1" />
                            Pro Member
                        </Badge>
                    ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <Badge variant="secondary" className="bg-green-900/50 text-green-400 border-green-500/50">
                                {remainingCredits} credits left today
                            </Badge>
                            <Button
                                variant="outline"
                                onClick={() => alert("Subscribe flow coming soon")}
                                className="border-green-500/50 text-green-400 hover:bg-green-900/20 hover:text-green-300"
                            >
                                <Sparkles size={16} className="mr-2" />
                                Upgrade to Pro
                            </Button>
                        </div>
                    )}
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by image name..."
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-zinc-900/50 border border-green-500/50 text-green-400 placeholder-green-700/50 focus:border-green-400 focus:outline-none transition-colors backdrop-blur-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-green-400">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
                        <span>Loading your creations...</span>
                    </div>
                </div>
            ) : arts.length === 0 ? (
                <div className="text-center py-12">
                    <Grid3X3 size={48} className="mx-auto text-green-500/50 mb-4" />
                    <p className="text-green-500/80 text-lg mb-4">No ASCII art found</p>
                    <p className="text-green-600/60 mb-6">Create your first ASCII art to get started!</p>
                    <Button
                        onClick={() => router.push("/ascii-art/new")}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-black font-bold flex items-center gap-2 mx-auto shadow-lg shadow-green-500/25"
                    >
                        <Plus size={18} />
                        Create Your First ASCII Art
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {arts.map((art) => (
                        <div
                            key={art.id}
                            className="bg-zinc-900/60 backdrop-blur-sm border border-green-500/30 p-6 rounded-lg shadow-lg hover:shadow-green-500/10 transition-all duration-300 group cursor-pointer hover:border-green-400/50"
                            onClick={() => router.push(`/ascii-art/${art.id}`)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-green-300 group-hover:text-green-200 transition-colors">{art.imageName}</h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Calendar size={14} className="text-green-500" />
                                        <p className="text-sm text-green-500/80">
                                            {new Date(art.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2"
                                    onClick={(e) => handleDelete(e, art.id)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-green-500/30">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="border-green-500/50 text-green-400 hover:bg-green-900/20 hover:text-green-300 disabled:opacity-50"
                    >
                        Previous
                    </Button>
                    <span className="text-green-400 text-sm px-4 py-2 bg-zinc-900/50 rounded border border-green-500/30">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="border-green-500/50 text-green-400 hover:bg-green-900/20 hover:text-green-300 disabled:opacity-50"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;

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
import { Trash2 } from "lucide-react";
import { deleteAsciiArt } from "@/actions/artAction";

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

    const remainingCredits = userData?.isSubscribed ? "∞" : Math.max(0, 3 - (userData?.dailyCreditsUsed || 0));

    return (
        <div className="p-4 max-w-3xl mx-auto relative">
            <div className="absolute top-4 right-4 text-sm text-gray-300 flex items-center gap-2">
                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-white px-2 py-1 text-sm">
                                {user.primaryEmailAddress?.emailAddress}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled>{user.primaryEmailAddress?.emailAddress}</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            <div className="flex justify-between items-center mb-4 mt-12">
                <h1 className="text-2xl font-bold">🖼️ Your ASCII Art Conversions</h1>
                <Button onClick={() => router.push("/ascii-art/new")}>New</Button>
            </div>

            <div className="flex items-center justify-between mb-4">
                {userData?.isSubscribed ? (
                    <Badge variant="default">Pro</Badge>
                ) : (
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary">{remainingCredits} credits left today</Badge>
                        <Button variant="outline" onClick={() => alert("Subscribe flow coming soon")}>
                            Subscribe
                        </Button>
                    </div>
                )}
            </div>

            <input
                type="text"
                placeholder="Search by image name..."
                className="w-full px-4 py-2 mb-4 rounded-md border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loading ? (
                <p>Loading...</p>
            ) : arts.length === 0 ? (
                <p>No results found.</p>
            ) : (
                <ul className="space-y-4">
                    {arts.map((art) => (
                        <li
                            key={art.id}
                            className="bg-zinc-900 text-white p-4 rounded-md shadow hover:bg-zinc-800 transition group relative cursor-pointer"
                            onClick={() => router.push(`/ascii-art/${art.id}`)}
                        >
                            <h2 className="text-lg font-semibold">{art.imageName}</h2>
                            <p className="text-right text-xs text-gray-400">{new Date(art.createdAt).toLocaleString()}</p>
                            <Button
                                variant="ghost"
                                className="absolute top-2 right-2 p-1 text-red-500 hover:bg-transparent"
                                onClick={(e) => handleDelete(e, art.id)}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-6">
                    <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                        Previous
                    </Button>
                    <span className="text-white text-sm">
                        Page {page} of {totalPages}
                    </span>
                    <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;

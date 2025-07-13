"use client";

import React, { FormEvent, useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import MatrixBackground from "@/components/MatrixBackground";

function SignIn() {
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();

    if (!isLoaded) return null;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!signIn || !setActive) {
            setError("Authentication not ready. Please try again.");
            return;
        }

        try {
            const result = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
            } else {
                console.log("Incomplete sign in", result);
            }
        } catch (error: any) {
            console.error("Error", error.errors?.[0]?.message || error.message);
            setError(error.errors?.[0]?.message || "Something went wrong");
        }
    }


    return (
        <>
            <MatrixBackground />

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md mx-auto mt-20 bg-zinc-900/80 backdrop-blur-sm text-green-400 border border-green-700 p-6 rounded-lg shadow-lg space-y-5 font-mono"
            >
                <h1 className="text-2xl font-bold text-center text-green-500">Login to Continue</h1>

                {error && (
                    <div className="bg-red-500 text-white px-4 py-2 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block mb-1 text-sm text-green-300">Email</label>
                    <Input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="you@example.com"
                        className="bg-zinc-800 border-green-600 text-green-300 placeholder-green-600"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm text-green-300">Password</label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-zinc-800 border-green-600 text-green-300 placeholder-green-600 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-2.5 text-green-500 hover:text-green-300"
                            aria-label="Toggle Password Visibility"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-black font-bold"
                >
                    Sign In
                </Button>

                <p className="text-sm text-center text-green-400 mt-2">
                    Don’t have an account?{" "}
                    <a href="/sign-up" className="underline hover:text-green-300">
                        Sign up
                    </a>
                </p>
            </form>
        </>
    );
}

export default SignIn;

"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import MatrixBackground from "@/components/MatrixBackground";
import { Spinner } from "@/components/ui/spinner";

function Signup() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    if (!isLoaded) return <Spinner />;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!signUp) {
            setError("Signup not ready. Please reload and try again.");
            return;
        }

        setIsLoading(true);
        try {
            await signUp.create({ emailAddress, password });
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setPendingVerification(true);
        } catch (error: any) {
            console.error(error);
            setError(error.errors?.[0]?.message || error.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        if (!signUp || !setActive) {
            setError("Verification not ready. Please reload and try again.");
            return;
        }

        setIsLoading(true);
        try {
            const completeSignup = await signUp.attemptEmailAddressVerification({ code });

            if (completeSignup.status === "complete") {
                await setActive({ session: completeSignup.createdSessionId });

                if (process.env.NEXT_PUBLIC_DEV === "true") {
                    await fetch("/api/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: emailAddress }),
                    });
                }

                router.push("/dashboard");
            } else {
                setError("Verification failed. Try again.");
            }
        } catch (error: any) {
            setError(error.errors?.[0]?.message || error.message || "Verification failed");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <MatrixBackground />
            <form
                onSubmit={pendingVerification ? handleVerify : handleSubmit}
                className="w-full max-w-md mx-auto mt-20 bg-zinc-900/80 backdrop-blur-sm text-green-400 border border-green-700 p-6 rounded-lg shadow-lg space-y-5 font-mono"
            >
                <h1 className="text-2xl font-bold text-center text-green-500">
                    {pendingVerification ? "Verify Your Email" : "Create an Account"}
                </h1>

                <p className="text-center text-green-300 text-sm">
                    {pendingVerification
                        ? "Enter the code sent to your email to complete sign up."
                        : "Sign up to get started converting images to ASCII!"}
                </p>

                {error && (
                    <div className="bg-red-500 text-white px-4 py-2 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {pendingVerification ? (
                    <div>
                        <label className="block mb-1 text-sm text-green-300">Verification Code</label>
                        <Input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter verification code"
                            className="bg-zinc-800 border-green-600 text-green-300 placeholder-green-600"
                            required
                        />
                    </div>
                ) : (
                    <>
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

                        <div>
                            <label className="block mb-1 text-sm text-green-300">Confirm Password</label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter your password"
                                    className="bg-zinc-800 border-green-600 text-green-300 placeholder-green-600 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-2 top-2.5 text-green-500 hover:text-green-300"
                                    aria-label="Toggle Confirm Password Visibility"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-black font-bold flex items-center justify-center gap-2"
                >
                    {isLoading && <Loader2 className="animate-spin" size={18} />}
                    {pendingVerification ? "Verify Email" : "Sign Up"}
                </Button>

                <p className="text-sm text-center text-green-400 mt-2">
                    Already have an account?{" "}
                    <a href="/sign-in" className="underline hover:text-green-300">
                        Sign In
                    </a>
                </p>
            </form>
        </>
    );
}

export default Signup;

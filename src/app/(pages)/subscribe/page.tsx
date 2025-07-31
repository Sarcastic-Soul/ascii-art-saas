"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown } from "lucide-react";

function SubscribePage() {
    return (
        <div className="min-h-screen bg-black/95 text-green-400 font-mono p-6">
            <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="text-center mb-12">
                    <motion.h1
                        className="text-4xl font-bold text-green-300 mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Sparkles className="inline-block mr-2" />
                        Upgrade Your ASCII Art Experience
                    </motion.h1>
                    <motion.p
                        className="text-green-500/80 text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Unlock unlimited creativity with our premium features
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <Card className="bg-zinc-900/50 border-zinc-700 h-full">
                            <CardHeader>
                                <CardTitle className="text-green-400 text-xl flex items-center gap-2">
                                    <Zap size={20} />
                                    Free Plan
                                </CardTitle>
                                <p className="text-green-500/60">Perfect for getting started</p>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-green-300">$0</span>
                                    <span className="text-green-500/80">/month</span>
                                </div>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-center gap-2">
                                        <Check size={16} className="text-green-400" />
                                        <span className="text-green-300">5 ASCII arts per day</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check size={16} className="text-green-400" />
                                        <span className="text-green-300">Basic characters set</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check size={16} className="text-green-400" />
                                        <span className="text-green-300">Standard resolution</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check size={16} className="text-green-400" />
                                        <span className="text-green-300">Public sharing</span>
                                    </li>
                                </ul>
                                <Button
                                    variant="outline"
                                    className="w-full border-green-500/50 text-green-400 hover:bg-green-900/20"
                                    disabled
                                >
                                    Current Plan
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Premium Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/50 h-full relative">
                            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-orange-600 text-black font-bold">
                                Most Popular
                            </Badge>
                            <CardHeader>
                                <CardTitle className="text-yellow-400 text-xl flex items-center gap-2">
                                    <Crown size={20} />
                                    Premium Plan
                                </CardTitle>
                                <p className="text-yellow-500/80">For serious ASCII artists</p>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-yellow-300">$9.99</span>
                                    <span className="text-yellow-500/80">/month</span>
                                </div>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-center gap-2">
                                        <Check size={16} className="text-yellow-400" />
                                        <span className="text-yellow-200">Unlimited ASCII arts</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check size={16} className="text-yellow-400" />
                                        <span className="text-yellow-200">Advanced character sets</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check size={16} className="text-yellow-400" />
                                        <span className="text-yellow-200">High resolution output</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check size={16} className="text-yellow-400" />
                                        <span className="text-yellow-200">Priority processing</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check size={16} className="text-yellow-400" />
                                        <span className="text-yellow-200">Custom watermarks</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check size={16} className="text-yellow-400" />
                                        <span className="text-yellow-200">Batch processing</span>
                                    </li>
                                </ul>
                                <Button
                                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-black font-bold shadow-lg shadow-yellow-500/25"
                                >
                                    Upgrade Now
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                >
                    <p className="text-green-500/60 text-sm">
                        Cancel anytime • 30-day money-back guarantee • Secure payment
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default SubscribePage;

"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <main className="min-h-screen text-green-400 font-mono px-4 py-10 flex flex-col items-center gap-10">
      {/* Terminal-style ASCII Banner */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 w-full max-w-3xl shadow-inner">
        <div className="flex items-center justify-between text-green-500 text-sm mb-2">
          <span className="text-green-500">ascii@terminal:~</span>
          <span className="text-green-500">[ASCII Art Converter]</span>
        </div>
        <pre className="text-xs sm:text-sm leading-tight whitespace-pre-wrap text-center">
          {`   
  █████████    █████████    █████████  █████ █████                                          
  ███░░░░░███  ███░░░░░███  ███░░░░░███░░███ ░░███                                           
 ░███    ░███ ░███    ░░░  ███     ░░░  ░███  ░███                                           
 ░███████████ ░░█████████ ░███          ░███  ░███                                           
 ░███░░░░░███  ░░░░░░░░███░███          ░███  ░███                                           
 ░███    ░███  ███    ░███░░███     ███ ░███  ░███                                           
 █████   █████░░█████████  ░░█████████  █████ █████                                          
░░░░░   ░░░░░  ░░░░░░░░░    ░░░░░░░░░  ░░░░░ ░░░░░                                           
                                                                                                                                                                                                                                                                                       
   █████████              █████                                                              
  ███░░░░░███            ░░███                                                               
 ░███    ░███  ████████  ███████                                                             
 ░███████████ ░░███░░███░░░███░                                                              
 ░███░░░░░███  ░███ ░░░   ░███                                                               
 ░███    ░███  ░███       ░███ ███                                                           
 █████   █████ █████      ░░█████                                                            
░░░░░   ░░░░░ ░░░░░        ░░░░░                                                             
                                                                                                                                                                                                                                                                                       
   █████████                                                      █████                      
  ███░░░░░███                                                    ░░███                       
 ███     ░░░   ██████  ████████   █████ █████  ██████  ████████  ███████    ██████  ████████ 
░███          ███░░███░░███░░███ ░░███ ░░███  ███░░███░░███░░███░░░███░    ███░░███░░███░░███
░███         ░███ ░███ ░███ ░███  ░███  ░███ ░███████  ░███ ░░░   ░███    ░███████  ░███ ░░░ 
░░███     ███░███ ░███ ░███ ░███  ░░███ ███  ░███░░░   ░███       ░███ ███░███░░░   ░███     
 ░░█████████ ░░██████  ████ █████  ░░█████   ░░██████  █████      ░░█████ ░░██████  █████    
  ░░░░░░░░░   ░░░░░░  ░░░░ ░░░░░    ░░░░░     ░░░░░░  ░░░░░        ░░░░░   ░░░░░░  ░░░░░     
                                                                                             
`}
        </pre>
      </div>

      <div className="text-center max-w-xl space-y-3">
        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {!isSignedIn ? (
            <>
              <Link href="/sign-in">
                <Button variant="outline" className="border-green-500 text-green-300 hover:bg-green-800">
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-green-600 hover:bg-green-700 text-black font-bold">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/dashboard">
              <Button className="bg-green-600 hover:bg-green-700 text-black font-bold">
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>
        <p className="text-green-500">
          Turn your images into quirky ASCII art — retro magic in one click.
        </p>
      </div>
    </main>
  );
}

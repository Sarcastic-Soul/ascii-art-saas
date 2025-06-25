import "@/app/globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { ClerkProvider, } from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <body>
            <div className="container mx-auto p-4">
              <div className="flex justify-end mb-4">
                <ModeToggle />
              </div>
              {children}
            </div>
            <Toaster />
          </body>
        </ThemeProvider>
      </html>
    </ClerkProvider>
  );
}

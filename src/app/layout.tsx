import "@/app/globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { ClerkProvider, } from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <body>
            <div className="container mx-auto">
              <div className="flex justify-end mb-4">
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

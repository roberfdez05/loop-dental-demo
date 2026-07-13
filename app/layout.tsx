import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoopAI · Clínica Dental Sonrisa",
  description:
    "Asistente de IA que responde a pacientes y gestiona leads automáticamente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-full min-h-screen flex-col bg-background text-foreground">
        {children}
        <Toaster
          position="bottom-right"
          offset={24}
          mobileOffset={{ bottom: "76px" }}
          toastOptions={{
            classNames: {
              toast:
                "rounded-xl! border! border-zinc-200! bg-white! shadow-[var(--shadow-soft-md)]! font-sans!",
              title: "text-zinc-900! font-medium! text-sm!",
              description: "text-zinc-500! text-sm!",
              icon: "text-accent-500!",
            },
          }}
        />
      </body>
    </html>
  );
}

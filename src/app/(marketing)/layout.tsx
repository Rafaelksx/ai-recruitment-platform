import Link from "next/link";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/20">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-cyan-main)] to-[var(--color-salmon-main)] flex items-center justify-center text-white shadow-lg">
              <Sparkles size={16} />
            </div>
            <span className="font-bold text-xl tracking-tight">TalentAI</span>
          </Link>
          <nav className="hidden md:flex gap-8 font-medium text-sm text-foreground/80">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#about" className="hover:text-foreground transition-colors">Why AI?</Link>
          </nav>
          <div className="flex gap-4">
            {user ? (
              <Link href="/app/dashboard" className="px-5 py-2.5 text-sm font-semibold bg-foreground text-background rounded-full hover:opacity-90 transition-opacity shadow-lg">
                Ir al Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="px-5 py-2.5 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="px-5 py-2.5 text-sm font-semibold bg-foreground text-background rounded-full hover:opacity-90 transition-opacity shadow-lg">
                  Start Free Trial
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 pt-20">
        {children}
      </main>

      <footer className="py-12 border-t border-black/5 dark:border-white/10 glass">
        <div className="container mx-auto px-6 text-center text-sm text-foreground/50">
          <p>© 2026 TalentAI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

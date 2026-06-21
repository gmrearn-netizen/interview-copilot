import { cn } from "@/lib/utils";
import type { ViewMode } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  History,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mic,
  Settings,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  view: ViewMode;
  onChangeView: (v: ViewMode) => void;
}

const navItems: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: "overlay", label: "Live Coach", icon: Mic },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "sessions", label: "Sessions", icon: History },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Layout({ children, view, onChangeView }: LayoutProps) {
  const { login, clear, isAuthenticated } = useInternetIdentity();

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-semibold text-lg tracking-tight text-gradient">
              Interview AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.id}
                data-ocid={`nav.${item.id}.tab`}
                onClick={() => onChangeView(item.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-smooth",
                  view === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                type="button"
                data-ocid="auth.logout_button"
                onClick={clear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <button
                type="button"
                data-ocid="auth.login_button"
                onClick={login}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-smooth"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
            <button
              type="button"
              data-ocid="nav.mobile_toggle"
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5"
                role="img"
                aria-label="Menu"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border px-4 py-2 space-y-1 bg-card">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.id}
                data-ocid={`nav.mobile.${item.id}.tab`}
                onClick={() => {
                  onChangeView(item.id);
                  setMobileOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-smooth",
                  view === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/40 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()}. Built with love using caffeine.ai
          </span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-smooth"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

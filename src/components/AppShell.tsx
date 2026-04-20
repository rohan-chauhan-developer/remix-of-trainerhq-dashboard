import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Activity, Zap, Library, Plus, Play, BarChart3, Circle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

const tabs = [
  { to: "/", label: "Overview", icon: Activity },
  { to: "/devices", label: "Devices", icon: Zap },
  { to: "/library", label: "Exercise Library", icon: Library },
  { to: "/builder", label: "Exercise Builder", icon: Plus },
  { to: "/session", label: "Live Session", icon: Play },
  { to: "/statistics", label: "Statistics", icon: BarChart3 },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const startSession = useAppStore((s) => s.startSession);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background sticky top-0 z-40">
        <div className="mx-auto max-w-[1600px] px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl gradient-neon flex items-center justify-center neon-glow">
              <Zap className="h-6 w-6 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-tight">ESP32 Training System</h1>
              <p className="text-xs text-muted-foreground">Advanced Digital Training Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Circle className="h-2.5 w-2.5 fill-[var(--neon)] text-[var(--neon)] animate-pulse-dot" />
              <span className="text-muted-foreground">System Online</span>
            </div>
            <button
              onClick={() => {
                startSession();
                toast.success("Session started");
                navigate({ to: "/session" });
              }}
              className="inline-flex items-center gap-2 rounded-lg gradient-neon px-5 py-2.5 text-sm font-semibold text-primary-foreground neon-glow hover:opacity-90 transition active:scale-[0.98]"
            >
              <Play className="h-4 w-4 fill-current" />
              Start Session
            </button>
          </div>
        </div>

        <nav className="mx-auto max-w-[1600px] px-6 flex items-center gap-1 overflow-x-auto scrollbar-thin">
          {tabs.map((t) => {
            const active = location.pathname === t.to;
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition ${
                  active ? "text-[var(--neon)]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
                {active && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--neon)] rounded-full neon-glow" />
                )}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-8">{children}</main>
    </div>
  );
}

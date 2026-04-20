import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, Plus, Play, Settings, BarChart3 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { recentActivity } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: OverviewPage,
});

const stats = [
  { label: "Active Devices", value: "7/8" },
  { label: "Total Sessions", value: "1,247" },
  { label: "Active Users", value: "23" },
  { label: "Avg Session Time", value: "18m" },
];

const badgeColor = {
  success: "bg-[var(--neon)]/15 text-[var(--neon)] border-[var(--neon)]/30",
  normal: "bg-muted text-muted-foreground border-border",
  info: "bg-[var(--info)]/15 text-[var(--info)] border-[var(--info)]/30",
} as const;

function OverviewPage() {
  const startSession = useAppStore((s) => s.startSession);

  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <div className="space-y-6">
          <Card>
            <SectionHeader icon={Activity} title="System Status" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.12), duration: 0.18 }}
                  className="rounded-xl bg-muted/40 border border-border p-5 text-center hover:border-[var(--neon)]/40 transition"
                >
                  <div className="text-3xl font-bold text-[var(--neon)] tracking-tight">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-5">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/builder" className="block">
                <QuickAction icon={Plus} label="New Exercise" primary />
              </Link>
              <Link
                to="/session"
                onClick={() => { startSession(); toast.success("Quick session started"); }}
                className="block"
              >
                <QuickAction icon={Play} label="Quick Start" />
              </Link>
              <Link to="/devices" className="block">
                <QuickAction icon={Settings} label="Settings" />
              </Link>
              <Link to="/statistics" className="block">
                <QuickAction icon={BarChart3} label="Reports" />
              </Link>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-bold mb-5">Recent Activity</h2>
          <ul className="space-y-3">
            {recentActivity.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground tabular-nums w-14 text-xs">{a.time}</span>
                  <span className="text-foreground">{a.text}</span>
                </div>
                <span className={`text-[10px] uppercase font-semibold border rounded-full px-2.5 py-0.5 ${badgeColor[a.type]}`}>
                  {a.type}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 card-glow">
      {children}
    </section>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-[var(--neon)]" />
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}

function QuickAction({ icon: Icon, label, primary }: { icon: React.ComponentType<{ className?: string }>; label: string; primary?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-5 flex items-center gap-3 transition cursor-pointer ${
        primary
          ? "gradient-neon border-transparent text-primary-foreground neon-glow hover:opacity-90"
          : "bg-muted/40 border-border hover:border-[var(--neon)]/40 hover:bg-muted/60"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-semibold text-sm">{label}</span>
    </div>
  );
}

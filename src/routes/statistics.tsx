import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Download, TrendingUp, TrendingDown, Target, Users, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAppStore } from "@/lib/store";
import { topPerformers } from "@/lib/data";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/statistics")({
  component: StatsPage,
});

const kpis = [
  { label: "Total Sessions", value: "2,847", delta: "+12%", up: true },
  { label: "Active Users", value: "156", delta: "+8%", up: true },
  { label: "Avg Session Time", value: "14.2m", delta: "-3%", up: false },
  { label: "Device Uptime", value: "99.2%", delta: "+0.5%", up: true },
];

const timeline = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  sessions: Math.round(150 + Math.sin(i / 2) * 40 + Math.random() * 30),
  users: Math.round(80 + Math.cos(i / 3) * 20 + Math.random() * 15),
}));

function StatsPage() {
  const exercises = useAppStore((s) => s.exercises);
  const devices = useAppStore((s) => s.devices);
  const [dateOpen, setDateOpen] = useState(false);
  const [range, setRange] = useState("Last 14 days");

  const exportReport = () => {
    const csv = [
      ["Metric", "Value"],
      ...kpis.map((k) => [k.label, k.value]),
      [],
      ["Day", "Sessions", "Users"],
      ...timeline.map((t) => [String(t.day), String(t.sessions), String(t.users)]),
    ].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "training-report.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded");
  };

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Training Statistics</h1>
          <p className="text-muted-foreground text-sm mt-1">Comprehensive analytics for your ESP32 training system · {range}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setDateOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-sm font-medium hover:bg-muted transition active:scale-[0.98]">
            <Calendar className="h-4 w-4" /> Date Range
          </button>
          <button onClick={exportReport} className="inline-flex items-center gap-2 rounded-lg gradient-neon px-4 py-2.5 text-sm font-semibold text-primary-foreground neon-glow hover:opacity-90 transition active:scale-[0.98]">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl bg-card border border-border p-5 card-glow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{k.label}</span>
              <span className={`flex items-center gap-1 text-xs font-semibold ${k.up ? "text-[var(--neon)]" : "text-destructive"}`}>
                {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {k.delta}
              </span>
            </div>
            <div className="text-3xl font-bold tabular-nums">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <section className="rounded-2xl bg-card border border-border p-6 card-glow">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-5"><Target className="h-5 w-5 text-[var(--neon)]" />Most Popular Exercises</h2>
          <ul className="space-y-3">
            {exercises.map((e, i) => (
              <li key={e.id} className="rounded-xl border border-border bg-muted/20 p-4 flex items-center gap-4">
                <span className="h-9 w-9 rounded-full bg-[var(--neon)]/15 text-[var(--neon)] flex items-center justify-center font-bold border border-[var(--neon)]/40">{i + 1}</span>
                <div className="flex-1">
                  <div className="font-semibold">{e.name}</div>
                  <span className={`text-[10px] font-bold uppercase rounded-md px-2 py-0.5 border ${e.difficulty === "Beginner" ? "border-[var(--neon)]/40 text-[var(--neon)] bg-[var(--neon)]/10" : "border-[var(--warning)]/40 text-[var(--warning)] bg-[var(--warning)]/10"}`}>{e.difficulty}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[var(--neon)] tabular-nums">{e.avgScore}%</div>
                  <div className="text-[10px] text-muted-foreground">{e.sessions} sessions</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-card border border-border p-6 card-glow">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-5"><Users className="h-5 w-5 text-[var(--neon)]" />Top Performers</h2>
          <ul className="space-y-3">
            {topPerformers.map((p) => (
              <li key={p.rank} className="rounded-xl border border-border bg-muted/20 p-4 flex items-center gap-4">
                <span className="h-9 w-9 rounded-full bg-[var(--neon)]/15 text-[var(--neon)] flex items-center justify-center font-bold border border-[var(--neon)]/40">{p.rank}</span>
                <div className="flex-1">
                  <div className="font-semibold">{p.name}</div>
                  <span className="text-[10px] font-bold uppercase rounded-md px-2 py-0.5 border border-[var(--warning)]/40 text-[var(--warning)] bg-[var(--warning)]/10">{p.tier}</span>
                  <span className="text-[11px] text-muted-foreground ml-2">{p.sessions} sessions</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[var(--neon)] tabular-nums">{p.score}%</div>
                  <div className="text-[10px] text-muted-foreground">{p.avgTime}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl bg-card border border-border p-6 card-glow mb-6">
        <h2 className="flex items-center gap-2 text-xl font-bold mb-5"><Zap className="h-5 w-5 text-[var(--neon)]" />Device Performance Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {devices.map((d, i) => {
            const usage = Math.max(60, 95 - i * 3);
            const sessions = 340 - i * 12;
            const avg = (0.21 + i * 0.01).toFixed(2);
            return (
              <div key={d.id} className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">Device #{d.id}</span>
                  <span className={`h-2 w-2 rounded-full ${d.status === "online" ? "bg-[var(--neon)]" : d.status === "warning" ? "bg-[var(--warning)]" : "bg-destructive"}`} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5"><span>Usage</span><span className="text-foreground font-semibold">{usage}%</span></div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-3"><div className="h-full gradient-neon" style={{ width: `${usage}%` }} /></div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground"><span>{sessions} sessions</span><span>{avg}s</span></div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl bg-card border border-border p-6 card-glow">
        <h2 className="flex items-center gap-2 text-xl font-bold mb-5"><TrendingUp className="h-5 w-5 text-[var(--neon)]" />Usage Timeline</h2>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0.01 160)" />
              <XAxis dataKey="day" stroke="oklch(0.62 0.01 160)" fontSize={11} />
              <YAxis stroke="oklch(0.62 0.01 160)" fontSize={11} />
              <Tooltip contentStyle={{ background: "oklch(0.10 0.005 160)", border: "1px solid oklch(0.20 0.01 160)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="sessions" stroke="oklch(0.78 0.22 145)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="users" stroke="oklch(0.70 0.15 230)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <Dialog open={dateOpen} onOpenChange={setDateOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Select Date Range</DialogTitle>
            <DialogDescription>Filter statistics by time period.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {["Last 7 days", "Last 14 days", "Last 30 days", "Last 90 days", "This year", "All time"].map((r) => (
              <button
                key={r}
                onClick={() => { setRange(r); setDateOpen(false); toast.success(`Range: ${r}`); }}
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${range === r ? "border-[var(--neon)] bg-[var(--neon)]/10 text-[var(--neon)]" : "border-border bg-muted/30 hover:bg-muted"}`}
              >
                {r}
              </button>
            ))}
          </div>
          <DialogFooter>
            <button onClick={() => setDateOpen(false)} className="text-sm text-muted-foreground hover:text-foreground px-3 py-2">Cancel</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

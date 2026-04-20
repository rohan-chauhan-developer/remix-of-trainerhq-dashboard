import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pause, Square, RotateCcw, Settings, Activity, Zap, TrendingUp, Play } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/session")({
  component: SessionPage,
});

function SessionPage() {
  const { sessionRunning, sessionPaused, startSession, pauseSession, stopSession, resetSession, devices } = useAppStore();
  const [elapsed, setElapsed] = useState(2);
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(1);
  const totalSteps = 8;

  useEffect(() => {
    if (!sessionRunning || sessionPaused) return;
    const t = setInterval(() => {
      setElapsed((e) => e + 1);
      setScore((s) => s + Math.floor(Math.random() * 5));
      setStep((s) => (Math.random() > 0.7 ? Math.min(s + 1, totalSteps) : s));
    }, 1000);
    return () => clearInterval(t);
  }, [sessionRunning, sessionPaused]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const progress = (step / totalSteps) * 100;
  const accuracy = Math.min(100, 80 + Math.floor(score % 21));

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Live Session Monitor</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time monitoring and control of training sessions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { resetSession(); setElapsed(0); setScore(0); setStep(1); toast.info("Session reset"); }} className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-sm font-medium hover:bg-muted transition">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button onClick={() => toast.info("Settings")} className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-sm font-medium hover:bg-muted transition">
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>
      </div>

      <section className="rounded-2xl bg-card border border-border p-6 card-glow mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2 text-xl font-bold"><Activity className="h-5 w-5 text-[var(--neon)]" />Session Control</h2>
          <span className={`text-[10px] font-bold tracking-wide rounded-md px-2.5 py-1 border ${sessionRunning && !sessionPaused ? "bg-[var(--neon)]/15 text-[var(--neon)] border-[var(--neon)]/40" : sessionPaused ? "bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/40" : "bg-muted text-muted-foreground border-border"}`}>
            {sessionRunning ? (sessionPaused ? "PAUSED" : "RUNNING") : "IDLE"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_auto] gap-6 items-center">
          <Stat value={`${mm}:${ss}`} label="Duration" />
          <Stat value={String(score)} label="Score" />
          <div>
            <div className="text-sm text-muted-foreground mb-1">Current Exercise</div>
            <div className="font-bold">Sequential Light Chase</div>
            <div className="text-sm text-muted-foreground mt-3 mb-1">Participant</div>
            <div className="font-bold">Alex Rodriguez</div>
          </div>
          <div className="flex gap-2">
            {!sessionRunning ? (
              <button onClick={() => { startSession(); toast.success("Session started"); }} className="inline-flex items-center gap-2 rounded-lg gradient-neon px-5 py-3 text-sm font-bold text-primary-foreground neon-glow">
                <Play className="h-4 w-4 fill-current" /> Start
              </button>
            ) : (
              <button onClick={pauseSession} className="inline-flex items-center gap-2 rounded-lg bg-[var(--warning)] px-5 py-3 text-sm font-bold text-[var(--warning-foreground)] hover:opacity-90 transition">
                <Pause className="h-4 w-4" /> {sessionPaused ? "Resume" : "Pause"}
              </button>
            )}
            <button onClick={() => { stopSession(); toast.info("Session stopped"); }} className="inline-flex items-center gap-2 rounded-lg bg-destructive px-5 py-3 text-sm font-bold text-destructive-foreground hover:opacity-90 transition">
              <Square className="h-4 w-4 fill-current" /> Stop
            </button>
            <button onClick={() => { setElapsed(0); setScore(0); setStep(1); toast.info("Reset"); }} className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-5 py-3 text-sm font-bold hover:bg-muted transition">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1.5"><span className="text-muted-foreground">Progress</span><span className="font-semibold tabular-nums">{step}/{totalSteps} steps</span></div>
          <Bar value={progress} />
          <div className="flex justify-between text-sm mt-4 mb-1.5"><span className="text-muted-foreground">Accuracy</span><span className="font-semibold tabular-nums">{accuracy}%</span></div>
          <Bar value={accuracy} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-2xl bg-card border border-border p-6 card-glow">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-5"><Zap className="h-5 w-5 text-[var(--neon)]" />Device Status Grid</h2>
          <div className="grid grid-cols-4 gap-3">
            {devices.map((d) => (
              <div key={d.id} className={`rounded-xl border p-3 text-center ${d.status === "online" ? "border-[var(--neon)]/40 bg-[var(--neon)]/5" : d.status === "warning" ? "border-[var(--warning)]/40 bg-[var(--warning)]/5" : "border-border bg-muted/20 opacity-60"}`}>
                <div className="text-xs text-muted-foreground">#{d.id}</div>
                <div className={`mx-auto mt-2 h-3 w-3 rounded-full ${d.status === "online" ? "bg-[var(--neon)] animate-pulse-dot" : d.status === "warning" ? "bg-[var(--warning)]" : "bg-destructive"}`} />
                <div className="text-[10px] font-semibold mt-2 uppercase tracking-wide">{d.status}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-card border border-border p-6 card-glow">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-5"><TrendingUp className="h-5 w-5 text-[var(--neon)]" />Live Performance Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <Metric value="0.28s" label="Avg Reaction" />
            <Metric value="0.19s" label="Best Reaction" />
            <Metric value={`${score}`} label="Total Hits" />
            <Metric value={`${accuracy}%`} label="Accuracy" />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-muted/30 border border-border p-5 text-center">
      <div className="text-4xl font-bold text-[var(--neon)] tabular-nums tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function Bar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div className="h-full gradient-neon transition-all duration-500" style={{ width: `${value}%` }} />
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-muted/30 border border-border p-4 text-center">
      <div className="text-2xl font-bold text-[var(--neon)] tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

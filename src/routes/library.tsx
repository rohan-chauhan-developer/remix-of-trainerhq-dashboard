import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Star, Clock, Zap, Users, Target, Play, Eye } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAppStore } from "@/lib/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { Difficulty, Exercise } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/library")({
  component: LibraryPage,
});

const difficultyColor: Record<Difficulty, string> = {
  Beginner: "bg-[var(--neon)]/15 text-[var(--neon)] border-[var(--neon)]/30",
  Intermediate: "bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/30",
  Advanced: "bg-destructive/15 text-destructive border-destructive/30",
};

function LibraryPage() {
  const exercises = useAppStore((s) => s.exercises);
  const startSession = useAppStore((s) => s.startSession);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [category, setCategory] = useState("All");
  const [previewing, setPreviewing] = useState<Exercise | null>(null);

  const filtered = exercises.filter((e) => {
    if (difficulty !== "All" && e.difficulty !== difficulty) return false;
    if (category !== "All" && e.category !== category) return false;
    if (search && !`${e.name} ${e.description} ${e.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Exercise Library</h1>
          <p className="text-muted-foreground text-sm mt-1">Discover and customize training exercises for your ESP32 system</p>
        </div>
        <Link
          to="/builder"
          className="inline-flex items-center gap-2 rounded-lg gradient-neon px-4 py-2.5 text-sm font-semibold text-primary-foreground neon-glow hover:opacity-90 transition active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Create New Exercise
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises, tags, or descriptions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-[var(--neon)]/60 focus:ring-1 focus:ring-[var(--neon)]/40"
          />
        </div>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rounded-lg bg-card border border-border px-4 py-2.5 text-sm min-w-[140px] focus:outline-none focus:border-[var(--neon)]/60">
          <option>All</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg bg-card border border-border px-4 py-2.5 text-sm min-w-[140px] focus:outline-none focus:border-[var(--neon)]/60">
          <option>All</option><option>Reaction</option><option>Agility</option><option>Team</option><option>Custom</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((e, i) => (
          <motion.article
            key={e.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.12), duration: 0.18 }}
            className="rounded-2xl bg-card border border-border p-5 card-glow hover:border-[var(--neon)]/40 transition flex flex-col"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-bold text-lg leading-tight">{e.name}</h3>
                <span className={`mt-2 inline-block text-[10px] font-bold tracking-wide rounded-md px-2 py-0.5 border ${difficultyColor[e.difficulty]}`}>
                  {e.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-[var(--warning)] text-[var(--warning)]" />
                <span className="font-semibold tabular-nums">{e.rating}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{e.description}</p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[var(--neon)]" />{e.duration}</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-[var(--neon)]" />{e.devices} devices</span>
              <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-[var(--neon)]" />{e.uses.toLocaleString()} uses</span>
            </div>

            <div className="mb-4">
              <h4 className="text-xs font-semibold mb-1.5 flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-[var(--neon)]" />Objectives:</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {e.objectives.slice(0, 2).map((o) => (
                  <li key={o} className="flex gap-1.5"><span className="text-[var(--neon)]">•</span>{o}</li>
                ))}
                {e.objectives.length > 2 && (
                  <li className="text-[var(--neon)] text-xs">+{e.objectives.length - 2} more objectives</li>
                )}
              </ul>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border mb-4">
              {e.tags.map((t) => (
                <span key={t} className="text-[10px] uppercase font-medium rounded-md border border-border bg-muted/40 px-2 py-0.5 text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-auto flex gap-2">
              <button
                onClick={() => setPreviewing(e)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm font-medium hover:bg-muted hover:border-[var(--neon)]/40 transition active:scale-[0.98]"
              >
                <Eye className="h-4 w-4" /> Preview
              </button>
              <button
                onClick={() => { startSession(); toast.success(`Starting ${e.name}`); navigate({ to: "/session" }); }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg gradient-neon px-3 py-2 text-sm font-semibold text-primary-foreground neon-glow hover:opacity-90 transition active:scale-[0.98]"
              >
                <Play className="h-4 w-4 fill-current" /> Run
              </button>
            </div>
          </motion.article>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-16">No exercises match your filters.</div>
        )}
      </div>

      <Dialog open={!!previewing} onOpenChange={(o) => !o && setPreviewing(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle>{previewing?.name}</DialogTitle>
            <DialogDescription>{previewing?.description}</DialogDescription>
          </DialogHeader>
          {previewing && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-3 text-center">
                <Stat label="Duration" value={previewing.duration} />
                <Stat label="Devices" value={String(previewing.devices)} />
                <Stat label="Rating" value={`${previewing.rating}★`} />
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-1.5"><Target className="h-4 w-4 text-[var(--neon)]" />Objectives</h4>
                <ul className="space-y-1 text-muted-foreground">
                  {previewing.objectives.map((o) => (
                    <li key={o} className="flex gap-1.5"><span className="text-[var(--neon)]">•</span>{o}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {previewing.tags.map((t) => (
                  <span key={t} className="text-[10px] uppercase font-medium rounded-md border border-border bg-muted/40 px-2 py-0.5 text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => { if (previewing) { startSession(); toast.success(`Starting ${previewing.name}`); setPreviewing(null); navigate({ to: "/session" }); } }}
              className="inline-flex items-center gap-2 rounded-lg gradient-neon px-4 py-2 text-sm font-semibold text-primary-foreground neon-glow"
            >
              <Play className="h-4 w-4 fill-current" /> Start Now
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/30 border border-border p-3">
      <div className="text-lg font-bold text-[var(--neon)]">{value}</div>
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
    </div>
  );
}

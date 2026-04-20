import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Copy, Save, Plus, Settings2, Layers, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import type { Difficulty } from "@/lib/data";

export const Route = createFileRoute("/builder")({
  component: BuilderPage,
});

interface DeviceAction { id: string; deviceId: number; action: string; }
interface Step { id: string; name: string; duration: number; actions: DeviceAction[]; }

function BuilderPage() {
  const navigate = useNavigate();
  const addExercise = useAppStore((s) => s.addExercise);
  const [name, setName] = useState("My Custom Exercise");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Beginner");
  const [category, setCategory] = useState("Custom");
  const [activeDevices, setActiveDevices] = useState(4);
  const [steps, setSteps] = useState<Step[]>([{ id: "s1", name: "Step 1", duration: 5000, actions: [] }]);
  const [activeStepId, setActiveStepId] = useState("s1");

  const activeStep = steps.find((s) => s.id === activeStepId) ?? steps[0];

  const updateStep = (patch: Partial<Step>) =>
    setSteps((prev) => prev.map((s) => (s.id === activeStepId ? { ...s, ...patch } : s)));

  const addStep = () => {
    const id = `s${steps.length + 1}`;
    const next: Step = { id, name: `Step ${steps.length + 1}`, duration: 5000, actions: [] };
    setSteps([...steps, next]);
    setActiveStepId(id);
  };

  const addAction = () => {
    updateStep({
      actions: [
        ...activeStep.actions,
        { id: `a${Date.now()}`, deviceId: 1, action: "LED On" },
      ],
    });
  };

  const save = () => {
    addExercise({
      id: `custom-${Date.now()}`,
      name,
      difficulty,
      description: description || "Custom exercise",
      duration: `${Math.round((steps.reduce((a, s) => a + s.duration, 0) / 1000) / 60)}-${Math.round(steps.reduce((a, s) => a + s.duration, 0) / 1000 / 60) + 2} mins`,
      devices: activeDevices,
      uses: 0,
      rating: 5.0,
      objectives: ["Custom training goal"],
      tags: [category.toLowerCase()],
      category,
      avgScore: 0,
      sessions: 0,
    });
    toast.success("Exercise saved to library");
    navigate({ to: "/library" });
  };

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Exercise Builder</h1>
          <p className="text-muted-foreground text-sm mt-1">Create custom training sequences for your ESP32 devices</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.info("Preview", { description: `${steps.length} steps · ${activeDevices} devices · ${(steps.reduce((a,s)=>a+s.duration,0)/1000).toFixed(1)}s` })} className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-sm font-medium hover:bg-muted transition active:scale-[0.98]">
            <Eye className="h-4 w-4" /> Preview
          </button>
          <button onClick={() => toast.success("Exercise duplicated")} className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-sm font-medium hover:bg-muted transition">
            <Copy className="h-4 w-4" /> Duplicate
          </button>
          <button onClick={save} className="inline-flex items-center gap-2 rounded-lg gradient-neon px-4 py-2.5 text-sm font-semibold text-primary-foreground neon-glow hover:opacity-90 transition">
            <Save className="h-4 w-4" /> Save Exercise
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
        <section className="rounded-2xl bg-card border border-border p-6 card-glow">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-5"><Settings2 className="h-5 w-5 text-[var(--neon)]" />Exercise Settings</h2>

          <Field label="Exercise Name">
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
          </Field>
          <Field label="Description">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your exercise..." rows={3} className="input resize-none" />
          </Field>
          <Field label="Difficulty">
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="input">
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </Field>
          <Field label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              <option>Custom</option><option>Reaction</option><option>Agility</option><option>Team</option>
            </select>
          </Field>

          <div className="mt-4">
            <label className="block text-sm font-semibold mb-2">Active Devices: {activeDevices}</label>
            <Slider value={[activeDevices]} onValueChange={([v]) => setActiveDevices(v)} min={1} max={8} step={1}
              className="[&_[data-slot=slider-range]]:bg-[var(--neon)] [&_[data-slot=slider-thumb]]:border-[var(--neon)]" />
          </div>

          <div className="mt-5">
            <label className="block text-sm font-semibold mb-2">Device Layout</label>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => {
                const active = n <= activeDevices;
                return (
                  <div key={n} className={`aspect-square rounded-md border flex items-center justify-center text-sm font-bold transition ${active ? "border-[var(--neon)] text-[var(--neon)] bg-[var(--neon)]/10 neon-glow" : "border-border text-muted-foreground bg-muted/30"}`}>
                    {n}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-card border border-border p-6 card-glow">
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex items-center gap-2 text-xl font-bold"><Layers className="h-5 w-5 text-[var(--neon)]" />Exercise Steps</h2>
            <button onClick={addStep} className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm font-medium hover:border-[var(--neon)]/40 transition">
              <Plus className="h-4 w-4" /> Add Step
            </button>
          </div>

          <div className="flex gap-2 mb-4 flex-wrap">
            {steps.map((s) => (
              <button key={s.id} onClick={() => setActiveStepId(s.id)} className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition ${s.id === activeStepId ? "border-[var(--neon)] text-[var(--neon)] bg-[var(--neon)]/10" : "border-border text-muted-foreground hover:text-foreground"}`}>
                {s.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <Field label="Step Name">
              <input value={activeStep.name} onChange={(e) => updateStep({ name: e.target.value })} className="input ring-1 ring-[var(--neon)]/40 border-[var(--neon)]/40" />
            </Field>
            <Field label="Duration (ms)">
              <input type="number" value={activeStep.duration} onChange={(e) => updateStep({ duration: Number(e.target.value) || 0 })} className="input" />
            </Field>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Device Actions</span>
            <button onClick={addAction} className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm font-medium hover:border-[var(--neon)]/40 transition">
              <Plus className="h-4 w-4" /> Add Action
            </button>
          </div>

          {activeStep.actions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 py-12 text-center">
              <Zap className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
              <p className="font-medium text-muted-foreground">No actions defined for this step</p>
              <p className="text-xs text-muted-foreground mt-1">Add actions to control your ESP32 devices</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {activeStep.actions.map((a) => (
                <li key={a.id} className="rounded-lg border border-border bg-muted/30 p-3 flex items-center gap-3">
                  <select value={a.deviceId} onChange={(e) => updateStep({ actions: activeStep.actions.map((x) => x.id === a.id ? { ...x, deviceId: Number(e.target.value) } : x) })} className="input flex-1">
                    {Array.from({ length: activeDevices }, (_, i) => i + 1).map((n) => <option key={n} value={n}>Device #{n}</option>)}
                  </select>
                  <select value={a.action} onChange={(e) => updateStep({ actions: activeStep.actions.map((x) => x.id === a.id ? { ...x, action: e.target.value } : x) })} className="input flex-1">
                    <option>LED On</option><option>LED Off</option><option>RGB Pulse</option><option>Buzzer</option><option>Wait Touch</option>
                  </select>
                  <button onClick={() => updateStep({ actions: activeStep.actions.filter((x) => x.id !== a.id) })} className="text-destructive text-xs px-2 hover:underline">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <style>{`.input{width:100%;background:var(--input);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-size:14px;color:var(--foreground);outline:none;transition:border-color .15s}.input:focus{border-color:var(--neon)}`}</style>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      {children}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wifi, Battery, Volume2, Settings, RefreshCw, Lightbulb, Thermometer } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAppStore } from "@/lib/store";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Device, DeviceStatus } from "@/lib/data";

export const Route = createFileRoute("/devices")({
  component: DevicesPage,
});

const statusStyle: Record<DeviceStatus, { dot: string; pill: string; label: string; ring: string }> = {
  online: { dot: "bg-[var(--neon)]", pill: "bg-[var(--neon)]/15 text-[var(--neon)] border-[var(--neon)]/30", label: "ONLINE", ring: "border-border hover:border-[var(--neon)]/40" },
  warning: { dot: "bg-[var(--warning)]", pill: "bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/40", label: "WARNING", ring: "border-[var(--warning)]/50 ring-1 ring-[var(--warning)]/30" },
  offline: { dot: "bg-destructive", pill: "bg-destructive/15 text-destructive border-destructive/30", label: "OFFLINE", ring: "border-border opacity-70" },
};

function DevicesPage() {
  const devices = useAppStore((s) => s.devices);
  const setVolume = useAppStore((s) => s.setDeviceVolume);
  const toggleLed = useAppStore((s) => s.toggleDeviceLed);
  const [configuring, setConfiguring] = useState<Device | null>(null);
  const [globalOpen, setGlobalOpen] = useState(false);

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Device Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor and control your ESP32 training devices</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => toast.success("Calibrating all devices...", { description: "This may take a few seconds" })}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-4 py-2.5 text-sm font-medium hover:bg-muted transition active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Calibrate All
          </button>
          <button
            onClick={() => setGlobalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg gradient-neon px-4 py-2.5 text-sm font-semibold text-primary-foreground neon-glow hover:opacity-90 transition active:scale-[0.98]"
          >
            <Settings className="h-4 w-4" />
            Global Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {devices.map((d, i) => {
          const s = statusStyle[d.status];
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.12), duration: 0.18 }}
              className={`rounded-2xl bg-card border ${s.ring} p-5 card-glow transition`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold">Training Device #{d.id}</h3>
                  <span className={`mt-2 inline-block text-[10px] font-bold tracking-wide rounded-md px-2 py-0.5 border ${s.pill}`}>
                    {s.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${s.dot} ${d.status === "online" ? "animate-pulse-dot" : ""}`} />
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1.5"><Battery className="h-3.5 w-3.5" /> {d.battery}%</span>
                <span className="flex items-center gap-1.5 justify-end"><Wifi className="h-3.5 w-3.5" /> {d.signal}%</span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">LED Status</span>
                  <Switch checked={d.ledOn} onCheckedChange={() => toggleLed(d.id)} className="data-[state=checked]:bg-[var(--neon)]" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span className={`h-2 w-2 rounded-full ${d.rgbActive ? "bg-fuchsia-500 shadow-[0_0_8px_theme(colors.fuchsia.500)]" : "bg-muted"}`} />
                  RGB {d.rgbActive ? "Active" : "Idle"}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium flex items-center gap-1.5"><Volume2 className="h-3.5 w-3.5" /> Volume</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{d.volume}%</span>
                  </div>
                  <Slider
                    value={[d.volume]}
                    onValueChange={([v]) => setVolume(d.id, v)}
                    max={100}
                    step={1}
                    className="[&_[data-slot=slider-range]]:bg-[var(--neon)] [&_[data-slot=slider-thumb]]:border-[var(--neon)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted-foreground border-t border-border pt-3">
                <span>Last Seen:</span><span className="text-right text-foreground">{d.lastSeen}</span>
                <span>Firmware:</span><span className="text-right text-foreground">{d.firmware}</span>
                <span className="flex items-center gap-1"><Thermometer className="h-3 w-3" />Temperature:</span>
                <span className="text-right text-foreground">{d.temperature}°C</span>
                <span>Uptime:</span><span className="text-right text-foreground">{d.uptime}</span>
              </div>

              <button
                onClick={() => setConfiguring(d)}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm font-medium hover:bg-muted hover:border-[var(--neon)]/40 transition active:scale-[0.98]"
              >
                <Settings className="h-4 w-4" />
                Configure
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Configure dialog */}
      <Dialog open={!!configuring} onOpenChange={(o) => !o && setConfiguring(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Configure Device #{configuring?.id}</DialogTitle>
            <DialogDescription>Adjust device parameters. Changes apply instantly.</DialogDescription>
          </DialogHeader>
          {configuring && (
            <div className="space-y-4">
              <Row label="Status" value={<span className="text-[var(--neon)] font-semibold">{statusStyle[configuring.status].label}</span>} />
              <Row label="Firmware" value={configuring.firmware} />
              <Row label="Battery" value={`${configuring.battery}%`} />
              <Row label="Signal" value={`${configuring.signal}%`} />
              <Row label="Temperature" value={`${configuring.temperature}°C`} />
              <Row label="Uptime" value={configuring.uptime} />
              <div>
                <label className="text-sm font-medium block mb-2">Volume ({configuring.volume}%)</label>
                <Slider
                  value={[configuring.volume]}
                  onValueChange={([v]) => setVolume(configuring.id, v)}
                  max={100}
                  step={1}
                  className="[&_[data-slot=slider-range]]:bg-[var(--neon)] [&_[data-slot=slider-thumb]]:border-[var(--neon)]"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">LED Status</span>
                <Switch checked={configuring.ledOn} onCheckedChange={() => toggleLed(configuring.id)} className="data-[state=checked]:bg-[var(--neon)]" />
              </div>
            </div>
          )}
          <DialogFooter>
            <button onClick={() => { toast.success(`Device #${configuring?.id} calibrated`); setConfiguring(null); }} className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-sm font-medium hover:bg-muted transition">
              <RefreshCw className="h-4 w-4" /> Calibrate
            </button>
            <button onClick={() => { toast.success("Configuration saved"); setConfiguring(null); }} className="inline-flex items-center gap-2 rounded-lg gradient-neon px-4 py-2 text-sm font-semibold text-primary-foreground neon-glow">
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Global Settings dialog */}
      <Dialog open={globalOpen} onOpenChange={setGlobalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Global Device Settings</DialogTitle>
            <DialogDescription>Apply settings across all connected devices.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Row label="Master Volume" value={
              <Slider defaultValue={[75]} max={100} step={1} className="w-40 [&_[data-slot=slider-range]]:bg-[var(--neon)] [&_[data-slot=slider-thumb]]:border-[var(--neon)]" />
            } />
            <Row label="RGB Sync Mode" value={<Switch defaultChecked className="data-[state=checked]:bg-[var(--neon)]" />} />
            <Row label="Auto-Sleep" value={<Switch className="data-[state=checked]:bg-[var(--neon)]" />} />
            <Row label="Firmware Channel" value={
              <select className="bg-input border border-border rounded-md px-2 py-1 text-sm">
                <option>Stable</option><option>Beta</option><option>Dev</option>
              </select>
            } />
          </div>
          <DialogFooter>
            <button onClick={() => { toast.success("Global settings applied"); setGlobalOpen(false); }} className="inline-flex items-center gap-2 rounded-lg gradient-neon px-4 py-2 text-sm font-semibold text-primary-foreground neon-glow">
              Apply to all devices
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

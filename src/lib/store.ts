import { create } from "zustand";
import { initialDevices, initialExercises, type Device, type Exercise } from "./data";

interface AppState {
  devices: Device[];
  exercises: Exercise[];
  sessionRunning: boolean;
  sessionPaused: boolean;
  setDeviceVolume: (id: number, v: number) => void;
  toggleDeviceLed: (id: number) => void;
  startSession: () => void;
  pauseSession: () => void;
  stopSession: () => void;
  resetSession: () => void;
  addExercise: (e: Exercise) => void;
}

export const useAppStore = create<AppState>((set) => ({
  devices: initialDevices,
  exercises: initialExercises,
  sessionRunning: false,
  sessionPaused: false,
  setDeviceVolume: (id, v) =>
    set((s) => ({ devices: s.devices.map((d) => (d.id === id ? { ...d, volume: v } : d)) })),
  toggleDeviceLed: (id) =>
    set((s) => ({ devices: s.devices.map((d) => (d.id === id ? { ...d, ledOn: !d.ledOn } : d)) })),
  startSession: () => set({ sessionRunning: true, sessionPaused: false }),
  pauseSession: () => set((s) => ({ sessionPaused: !s.sessionPaused })),
  stopSession: () => set({ sessionRunning: false, sessionPaused: false }),
  resetSession: () => set({ sessionRunning: false, sessionPaused: false }),
  addExercise: (e) => set((s) => ({ exercises: [e, ...s.exercises] })),
}));

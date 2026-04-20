export type DeviceStatus = "online" | "warning" | "offline";

export interface Device {
  id: number;
  status: DeviceStatus;
  battery: number;
  signal: number;
  ledOn: boolean;
  rgbActive: boolean;
  volume: number;
  firmware: string;
  temperature: number;
  uptime: string;
  lastSeen: string;
}

export const initialDevices: Device[] = [
  { id: 1, status: "online", battery: 92, signal: 85, ledOn: true, rgbActive: true, volume: 75, firmware: "v2.1.3", temperature: 32, uptime: "14h 32m", lastSeen: "2s ago" },
  { id: 2, status: "online", battery: 88, signal: 92, ledOn: true, rgbActive: true, volume: 80, firmware: "v2.1.3", temperature: 29, uptime: "14h 32m", lastSeen: "1s ago" },
  { id: 3, status: "warning", battery: 23, signal: 45, ledOn: false, rgbActive: false, volume: 60, firmware: "v2.1.2", temperature: 35, uptime: "5h 15m", lastSeen: "30s ago" },
  { id: 4, status: "online", battery: 95, signal: 88, ledOn: true, rgbActive: true, volume: 85, firmware: "v2.1.3", temperature: 31, uptime: "14h 32m", lastSeen: "3s ago" },
  { id: 5, status: "online", battery: 78, signal: 82, ledOn: true, rgbActive: false, volume: 70, firmware: "v2.1.3", temperature: 30, uptime: "12h 10m", lastSeen: "4s ago" },
  { id: 6, status: "warning", battery: 45, signal: 68, ledOn: true, rgbActive: true, volume: 65, firmware: "v2.1.3", temperature: 34, uptime: "8h 22m", lastSeen: "10s ago" },
  { id: 7, status: "online", battery: 90, signal: 91, ledOn: true, rgbActive: true, volume: 75, firmware: "v2.1.3", temperature: 28, uptime: "14h 32m", lastSeen: "2s ago" },
  { id: 8, status: "offline", battery: 12, signal: 0, ledOn: false, rgbActive: false, volume: 50, firmware: "v2.1.1", temperature: 0, uptime: "0m", lastSeen: "2h ago" },
];

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Exercise {
  id: string;
  name: string;
  difficulty: Difficulty;
  description: string;
  duration: string;
  devices: number;
  uses: number;
  rating: number;
  objectives: string[];
  tags: string[];
  category: string;
  avgScore: number;
  sessions: number;
}

export const initialExercises: Exercise[] = [
  {
    id: "seq-light-chase",
    name: "Sequential Light Chase",
    difficulty: "Beginner",
    description: "A classic reaction training where LEDs light up in sequence and players must touch each device before the light moves to the next one.",
    duration: "2-5 mins",
    devices: 8,
    uses: 1247,
    rating: 4.8,
    objectives: ["Improve reaction time", "Enhance hand-eye coordination", "Build sequential focus"],
    tags: ["reaction", "sequence", "beginner"],
    category: "Reaction",
    avgScore: 85,
    sessions: 489,
  },
  {
    id: "random-pattern",
    name: "Random Pattern Training",
    difficulty: "Intermediate",
    description: "Devices light up in random patterns, testing quick decision making and multi-directional movement.",
    duration: "3-8 mins",
    devices: 6,
    uses: 892,
    rating: 4.6,
    objectives: ["Improve decision making", "Enhance agility", "Build spatial awareness"],
    tags: ["random", "agility", "decision"],
    category: "Agility",
    avgScore: 72,
    sessions: 234,
  },
  {
    id: "paired-goal",
    name: "Paired Goal Training",
    difficulty: "Intermediate",
    description: "Devices work in pairs as goals. When a pair lights up, players must move an object between them.",
    duration: "5-10 mins",
    devices: 8,
    uses: 2156,
    rating: 4.9,
    objectives: ["Improve passing accuracy", "Enhance team coordination", "Build communication"],
    tags: ["team", "coordination", "passing"],
    category: "Team",
    avgScore: 78,
    sessions: 367,
  },
];

export interface ActivityItem {
  id: string;
  time: string;
  text: string;
  type: "success" | "normal" | "info";
}

export const recentActivity: ActivityItem[] = [
  { id: "a1", time: "2m ago", text: "Device #3 connected", type: "success" },
  { id: "a2", time: "5m ago", text: "Exercise completed", type: "normal" },
  { id: "a3", time: "12m ago", text: "New user registered", type: "info" },
  { id: "a4", time: "18m ago", text: "Device #7 calibrated", type: "normal" },
  { id: "a5", time: "25m ago", text: "Session started", type: "success" },
];

export const topPerformers = [
  { rank: 1, name: "Alex Rodriguez", tier: "Pro", sessions: 67, score: 92, avgTime: "18.4h" },
  { rank: 2, name: "Sarah Chen", tier: "Advanced", sessions: 54, score: 88, avgTime: "14.2h" },
  { rank: 3, name: "Mike Johnson", tier: "Advanced", sessions: 48, score: 85, avgTime: "12.8h" },
  { rank: 4, name: "Emma Wilson", tier: "Intermediate", sessions: 41, score: 81, avgTime: "10.5h" },
  { rank: 5, name: "James Park", tier: "Intermediate", sessions: 38, score: 79, avgTime: "9.2h" },
];

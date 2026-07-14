// shared types used across components

export interface Duration {
  label: string;
  minutes: number;
}

export interface LogEntry {
  label: string;
  time: string;
  minutes: number;
  status: "done" | "skipped";
}

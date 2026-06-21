export interface AudioState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
}

export interface AnswerState {
  answer: string;
  isLoading: boolean;
  error: string | null;
}

export interface StealthSettings {
  opacity: number;
  collapsed: boolean;
  position: { x: number; y: number };
}

export type ViewMode =
  | "overlay"
  | "dashboard"
  | "profile"
  | "sessions"
  | "settings";

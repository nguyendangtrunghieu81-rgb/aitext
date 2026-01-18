export interface User {
  username: string;
  fullName: string;
  role: 'admin' | 'user';
}

export interface TtsState {
  isLoading: boolean;
  error: string | null;
  audioUrl: string | null;
}

export interface VoiceSampleState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}

export enum LoginStatus {
  LOGGED_OUT,
  LOGGED_IN,
  ERROR
}
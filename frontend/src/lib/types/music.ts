/**
 * Core musical types and interfaces for the ScribbleTune02 project
 */

export interface MusicalNote {
  note: string | string[] | null;
  length: number;
  level: number;
}

export interface ClipConfig {
  notes: string | string[];
  pattern: string;
  subdiv: '1n' | '2n' | '4n' | '8n' | '16n' | '32n';
  amp?: number;
  accentLow?: number;
  sizzle?: string;
  sizzleReps?: number;
}

export interface DrumConfig {
  kick: string;
  snare: string;
  closedHat: string;
  openHat: string;
  crash: string;
  tomLow: string;
  tomMid: string;
  tomHigh: string;
}

export interface ChordProgression {
  scaleKey: string;
  progression: string;
  chords: string[];
  bassRoots: string[];
}

export interface TrackInfo {
  name: string;
  filename: string;
  description: string;
  abletonInstrument?: string;
  fxChain?: string[];
}

export interface GenerationConfig {
  bpm: number;
  bars: number;
  outputDir: string;
  drumConfig: DrumConfig;
  chordProgression: ChordProgression;
}

export type Subdivision = '1n' | '2n' | '4n' | '8n' | '16n' | '32n';
export type NoteName = string;
export type Pattern = string;
export type BPM = number;

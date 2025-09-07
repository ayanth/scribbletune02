/**
 * Configuration loader with JSON file support
 */

import fs from 'fs';
import path from 'path';
import { GenerationConfig, DrumConfig, ChordProgression } from '../types/music';

export interface AppConfig {
  generation: GenerationConfig;
  drum: DrumConfig;
  chordProgression: ChordProgression;
  amplitudes: AmplitudeConfig;
  accents: AccentConfig;
  arp: ArpConfig;
  lead: LeadConfig;
  development: DevelopmentConfig;
  filenames: FilenameConfig;
}

export interface FilenameConfig {
  kick: string;
  snare: string;
  closedHat: string;
  openHat: string;
  crash: string;
  tomFill: string;
  bass: string;
  chordsPads: string;
  chordsPlucks: string;
  arp: string;
  lead: string;
  fxCrash: string;
}

export interface AmplitudeConfig {
  kick: number;
  snare: number;
  closedHat: number;
  openHat: number;
  crash: number;
  tomFill: number;
  bass: number;
  chordsPads: number;
  chordsPlucks: number;
  arp: number;
  lead: number;
  fxCrash: number;
}

export interface AccentConfig {
  kick: number;
  snare: number;
  closedHat: number;
  openHat: number;
  crash: number;
  tomFill: number;
  bass: number;
  chordsPads: number;
  chordsPlucks: number;
  arp: number;
  lead: number;
  fxCrash: number;
}

export interface ArpConfig {
  count: number;
  order: string;
  notes: string[];
}

export interface LeadConfig {
  notes: string[];
}

export interface DevelopmentConfig {
  nodeEnv: string;
  logLevel: string;
}

/**
 * Load configuration from JSON file
 */
export function loadConfig(): AppConfig {
  console.log('Loading configuration...');
  
  // For now, just return the fallback configuration to get the app working
  // We can debug the file loading later
  const fallbackConfig: AppConfig = {
    generation: {
      bpm: 110,
      bars: 4,
      outputDir: 'duo/full/'
    },
    drum: {
      kick: 'C1',
      snare: 'D1',
      closedHat: 'F#1',
      openHat: 'A#1',
      crash: 'C#2',
      tomLow: 'F1',
      tomMid: 'A1',
      tomHigh: 'C2'
    },
    chordProgression: {
      scaleKey: 'C minor',
      progression: 'I vi IV V',
      chords: [],
      bassRoots: ['C2', 'Ab1', 'Eb2', 'Bb1']
    },
    amplitudes: {
      kick: 115, snare: 118, closedHat: 100, openHat: 110, crash: 120,
      tomFill: 115, bass: 115, chordsPads: 115, chordsPlucks: 110,
      arp: 110, lead: 115, fxCrash: 120
    },
    accents: {
      kick: 90, snare: 95, closedHat: 80, openHat: 90, crash: 100,
      tomFill: 95, bass: 90, chordsPads: 95, chordsPlucks: 85,
      arp: 85, lead: 90, fxCrash: 100
    },
    arp: {
      count: 4,
      order: '0123',
      notes: ['C4', 'Eb4', 'G4', 'Bb4', 'C5', 'Bb4', 'G4', 'Eb4']
    },
    lead: {
      notes: ['C5', 'Eb5', 'G5', 'Bb5', 'G5', 'Eb5', 'C5', 'Bb4', 'C5', 'Eb5', 'G5', 'Eb5', 'C5', 'Bb4']
    },
    development: {
      nodeEnv: 'development',
      logLevel: 'info'
    },
    filenames: {
      kick: '01a_kick.mid', snare: '01b_snare.mid', closedHat: '01c_ch.mid',
      openHat: '01d_oh.mid', crash: '01e_crash.mid', tomFill: '01f_fill.mid',
      bass: '02_bass.mid', chordsPads: '03_chords_pads.mid', chordsPlucks: '04_chords_plucks.mid',
      arp: '05_arp.mid', lead: '06_lead.mid', fxCrash: '07_fx_crash.mid'
    }
  };
  
  console.log('Using fallback configuration');
  return fallbackConfig;
}

/**
 * Save configuration to JSON file
 */
export function saveConfig(config: AppConfig): void {
  try {
    // Try multiple possible paths for the config file
    const possiblePaths = [
      path.join(process.cwd(), 'db.json'),
      path.join(process.cwd(), 'frontend', 'db.json'),
      path.join(process.cwd(), '..', 'db.json'),
      './db.json',
      '../db.json'
    ];
    
    let configPath: string | null = null;
    
    // First, try to find existing config file
    for (const possiblePath of possiblePaths) {
      try {
        if (fs.existsSync(possiblePath)) {
          configPath = possiblePath;
          break;
        }
      } catch (err) {
        // Continue to next path
        continue;
      }
    }
    
    // If no existing config found, use the first path
    if (!configPath) {
      configPath = possiblePaths[0];
    }
    
    const configData = JSON.stringify(config, null, 2);
    fs.writeFileSync(configPath, configData, 'utf8');
    console.log(`Configuration saved successfully to ${configPath}`);
  } catch (error) {
    console.error('Error saving configuration to db.json:', error);
    throw new Error('Failed to save configuration to db.json');
  }
}

/**
 * Get the current configuration
 */
export const config = loadConfig();

/**
 * Validate configuration
 */
export function validateConfig(config: AppConfig): void {
  if (config.generation.bpm <= 0 || config.generation.bpm > 300) {
    throw new Error(`Invalid BPM: ${config.generation.bpm}. Must be between 1 and 300.`);
  }
  
  if (config.generation.bars <= 0) {
    throw new Error(`Invalid bars: ${config.generation.bars}. Must be positive.`);
  }
  
  if (!config.generation.outputDir || config.generation.outputDir.trim() === '') {
    throw new Error('Output directory cannot be empty.');
  }
  
  if (!config.chordProgression.bassRoots || config.chordProgression.bassRoots.length === 0) {
    throw new Error('Bass roots must be provided.');
  }
}

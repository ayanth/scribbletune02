/**
 * Chord generator with TypeScript types
 */

import ScribbleTune from 'scribbletune';
import * as fs from 'fs';
import * as path from 'path';
import type { ClipConfig, GenerationConfig, ChordProgression } from '../types/music';
import { TRACK_INFO } from '../types/constants';
import { config } from '../config';
// Import the patched ScribbleTune to enable automatic track naming
import '../utils/scribbletune-patch';

export class ChordGenerator {
  private config: GenerationConfig;
  private chordProgression: ChordProgression;

  constructor(config: GenerationConfig) {
    this.config = config;
    this.chordProgression = config.chordProgression;
  }

  /**
   * Generate chord pads with whole notes
   */
  public generateChordPads(): void {
    const padPattern = 'x___'.repeat(this.chordProgression.chords.length);
    
    const clipConfig: ClipConfig = {
      notes: this.chordProgression.chords,
      pattern: padPattern,
      subdiv: '1n',
      amp: config.amplitudes.chordsPads,
      accentLow: config.accents.chordsPads,
    };

    const clip = ScribbleTune.clip(clipConfig);
    const outputPath = path.join(this.config.outputDir, TRACK_INFO.chordsPads.filename);
    
    this.ensureOutputDir();
    ScribbleTune.midi(clip, outputPath, this.config.bpm);
    console.log(`✅ Generated ${TRACK_INFO.chordsPads.name}: ${outputPath}`);
  }

  /**
   * Generate chord plucks with gated 1/8 pattern
   */
  public generateChordPlucks(): void {
    const pluckPatternPerChord = 'x-x-'.repeat(4); // 1 bar of 1/8ths per chord
    const pluckPattern = pluckPatternPerChord.repeat(this.chordProgression.chords.length);
    
    const clipConfig: ClipConfig = {
      notes: this.chordProgression.chords,
      pattern: pluckPattern,
      subdiv: '8n',
      amp: config.amplitudes.chordsPlucks,
      accentLow: config.accents.chordsPlucks,
      sizzle: 'sin',
      sizzleReps: this.chordProgression.chords.length,
    };

    const clip = ScribbleTune.clip(clipConfig);
    const outputPath = path.join(this.config.outputDir, TRACK_INFO.chordsPlucks.filename);
    
    ScribbleTune.midi(clip, outputPath, this.config.bpm);
    console.log(`✅ Generated ${TRACK_INFO.chordsPlucks.name}: ${outputPath}`);
  }

  /**
   * Generate all chord patterns
   */
  public generateAll(): void {
    console.log('🎹 Generating chord patterns...');
    this.generateChordPads();
    this.generateChordPlucks();
    console.log('✅ All chord patterns generated!');
  }

  /**
   * Ensure output directory exists
   */
  private ensureOutputDir(): void {
    if (!fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true });
    }
  }
}

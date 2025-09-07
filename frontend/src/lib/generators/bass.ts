/**
 * Bass generator with TypeScript types
 */

import ScribbleTune from 'scribbletune';
import * as fs from 'fs';
import * as path from 'path';
import type { ClipConfig, GenerationConfig, ChordProgression } from '../types/music';
import { TRACK_INFO } from '../types/constants';
import { config } from '../config';
// Import the patched ScribbleTune to enable automatic track naming
import '../utils/scribbletune-patch';

export class BassGenerator {
  private config: GenerationConfig;
  private chordProgression: ChordProgression;

  constructor(config: GenerationConfig) {
    this.config = config;
    this.chordProgression = config.chordProgression;
  }

  /**
   * Generate bass notes per bar (repeats each root 4 times)
   */
  private generateBassNotesPerBar(root: string): string[] {
    return [root, root, root, root];
  }

  /**
   * Generate bass pattern with pulsing 1/8 notes
   */
  public generateBass(): void {
    // Build a notes array that repeats each root 4×
    const bassNotes = this.chordProgression.bassRoots.flatMap(root => 
      this.generateBassNotesPerBar(root)
    );
    
    // Pattern has four 'x' per bar with "x-".repeat(4)
    const bassPattern = 'x-'.repeat(4 * this.chordProgression.bassRoots.length);
    
    const clipConfig: ClipConfig = {
      notes: bassNotes,
      pattern: bassPattern,
      subdiv: '8n',
      amp: config.amplitudes.bass,
      accentLow: config.accents.bass,
    };

    const clip = ScribbleTune.clip(clipConfig);
    const outputPath = path.join(this.config.outputDir, TRACK_INFO.bass.filename);
    
    this.ensureOutputDir();
    ScribbleTune.midi(clip, outputPath, this.config.bpm);
    console.log(`✅ Generated ${TRACK_INFO.bass.name}: ${outputPath}`);
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

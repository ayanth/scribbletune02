/**
 * Arpeggio generator with TypeScript types
 */

import ScribbleTune from 'scribbletune';
import * as fs from 'fs';
import * as path from 'path';
import type { ClipConfig, GenerationConfig, ChordProgression } from '../types/music';
import { TRACK_INFO } from '../types/constants';
import { config } from '../config';
// Import the patched ScribbleTune to enable automatic track naming
import '../utils/scribbletune-patch';

export class ArpGenerator {
  private config: GenerationConfig;
  private chordProgression: ChordProgression;

  constructor(config: GenerationConfig) {
    this.config = config;
    this.chordProgression = config.chordProgression;
  }

  /**
   * Generate 16th ascending arpeggio
   */
  public generateArp(): void {
    // Use arpeggio notes from configuration
    const arpNotes = config.arp.notes;
    
    const clipConfig: ClipConfig = {
      notes: arpNotes,
      pattern: 'x-'.repeat(16), // 1 bar of 16ths; loop in DAW as needed
      subdiv: '16n',
      amp: config.amplitudes.arp,
      accentLow: config.accents.arp,
    };

    const clip = ScribbleTune.clip(clipConfig);
    const outputPath = path.join(this.config.outputDir, TRACK_INFO.arp.filename);
    
    this.ensureOutputDir();
    ScribbleTune.midi(clip, outputPath, this.config.bpm);
    console.log(`✅ Generated ${TRACK_INFO.arp.name}: ${outputPath}`);
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

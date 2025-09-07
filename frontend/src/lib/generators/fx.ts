/**
 * FX generator with TypeScript types
 */

import ScribbleTune from 'scribbletune';
import * as fs from 'fs';
import * as path from 'path';
import type { ClipConfig, GenerationConfig, DrumConfig } from '../types/music';
import { TRACK_INFO } from '../types/constants';
import { config } from '../config';
// Import the patched ScribbleTune to enable automatic track naming
import '../utils/scribbletune-patch';

export class FxGenerator {
  private config: GenerationConfig;
  private drumConfig: DrumConfig;

  constructor(config: GenerationConfig) {
    this.config = config;
    this.drumConfig = config.drumConfig;
  }

  /**
   * Generate FX crash (big entrance)
   */
  public generateFxCrash(): void {
    const clipConfig: ClipConfig = {
      notes: this.drumConfig.crash,
      pattern: 'x---------------',
      subdiv: '16n',
      amp: config.amplitudes.fxCrash,
      accentLow: config.accents.fxCrash,
    };

    const clip = ScribbleTune.clip(clipConfig);
    const outputPath = path.join(this.config.outputDir, TRACK_INFO.fxCrash.filename);
    
    this.ensureOutputDir();
    ScribbleTune.midi(clip, outputPath, this.config.bpm);
    console.log(`✅ Generated ${TRACK_INFO.fxCrash.name}: ${outputPath}`);
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

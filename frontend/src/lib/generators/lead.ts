/**
 * Lead melody generator with TypeScript types
 */

import ScribbleTune from 'scribbletune';
import * as fs from 'fs';
import * as path from 'path';
import type { ClipConfig, GenerationConfig } from '../types/music';
import { TRACK_INFO } from '../types/constants';
import { config } from '../config';
// Import the patched ScribbleTune to enable automatic track naming
import '../utils/scribbletune-patch';

export class LeadGenerator {
  private config: GenerationConfig;

  constructor(config: GenerationConfig) {
    this.config = config;
  }

  /**
   * Generate lead melody with rests
   */
  public generateLead(): void {
    // Use lead notes from configuration
    const leadNotes = config.lead.notes;
    
    const leadPattern = 'xxxxxxx-' + 'xxxxxxx-'; // 16 chars: 7 hits + rest, twice
    
    const clipConfig: ClipConfig = {
      notes: leadNotes,
      pattern: leadPattern,
      subdiv: '16n',
      amp: config.amplitudes.lead,
      accentLow: config.accents.lead,
    };

    const clip = ScribbleTune.clip(clipConfig);
    const outputPath = path.join(this.config.outputDir, TRACK_INFO.lead.filename);
    
    this.ensureOutputDir();
    ScribbleTune.midi(clip, outputPath, this.config.bpm);
    console.log(`✅ Generated ${TRACK_INFO.lead.name}: ${outputPath}`);
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

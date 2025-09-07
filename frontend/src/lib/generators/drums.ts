/**
 * Drum pattern generator with TypeScript types
 */

import ScribbleTune from 'scribbletune';
import * as fs from 'fs';
import * as path from 'path';
import type { ClipConfig, DrumConfig, GenerationConfig, TrackInfo } from '../types/music';
import { TRACK_INFO } from '../types/constants';
import { config } from '../config';
// Import the patched ScribbleTune to enable automatic track naming
import '../utils/scribbletune-patch';

export class DrumGenerator {
  private config: GenerationConfig;
  private drumConfig: DrumConfig;

  constructor(config: GenerationConfig) {
    this.config = config;
    this.drumConfig = config.drumConfig;
  }

  /**
   * Helper to repeat a 1-bar pattern N bars
   */
  private repeatPattern(bar: string, bars: number = 1): string {
    return bar.repeat(bars);
  }

  /**
   * Generate kick drum pattern
   */
  public generateKick(): void {
    const kickBar = 'x---x---x---x---'; // four-on-the-floor
    const pattern = this.repeatPattern(kickBar, this.config.bars);
    
    const clipConfig: ClipConfig = {
      notes: this.drumConfig.kick,
      pattern,
      subdiv: '16n',
      amp: config.amplitudes.kick,
      accentLow: config.accents.kick,
    };

    const clip = ScribbleTune.clip(clipConfig);
    const outputPath = path.join(this.config.outputDir, TRACK_INFO.kick.filename);
    
    this.ensureOutputDir();
    ScribbleTune.midi(clip, outputPath, this.config.bpm);
    console.log(`✅ Generated ${TRACK_INFO.kick.name}: ${outputPath}`);
  }

  /**
   * Generate snare drum pattern
   */
  public generateSnare(): void {
    const snareBar = '----x-------x---'; // 2 & 4
    const pattern = this.repeatPattern(snareBar, this.config.bars);
    
    const clipConfig: ClipConfig = {
      notes: this.drumConfig.snare,
      pattern,
      subdiv: '16n',
      amp: config.amplitudes.snare,
      accentLow: config.accents.snare,
    };

    const clip = ScribbleTune.clip(clipConfig);
    const outputPath = path.join(this.config.outputDir, TRACK_INFO.snare.filename);
    
    ScribbleTune.midi(clip, outputPath, this.config.bpm);
    console.log(`✅ Generated ${TRACK_INFO.snare.name}: ${outputPath}`);
  }

  /**
   * Generate closed hat pattern
   */
  public generateClosedHat(): void {
    const chOffbeat = '-x-x-x-x-x-x-x-x'; // closed hats on the off-beats
    const pattern = this.repeatPattern(chOffbeat, this.config.bars);
    
    const clipConfig: ClipConfig = {
      notes: this.drumConfig.closedHat,
      pattern,
      subdiv: '16n',
      amp: config.amplitudes.closedHat,
      accentLow: config.accents.closedHat,
    };

    const clip = ScribbleTune.clip(clipConfig);
    const outputPath = path.join(this.config.outputDir, TRACK_INFO.closedHat.filename);
    
    ScribbleTune.midi(clip, outputPath, this.config.bpm);
    console.log(`✅ Generated ${TRACK_INFO.closedHat.name}: ${outputPath}`);
  }

  /**
   * Generate open hat pattern
   */
  public generateOpenHat(): void {
    const ohBar = '----x-------x---'; // light opens on 2 & 4
    const pattern = this.repeatPattern(ohBar, this.config.bars);
    
    const clipConfig: ClipConfig = {
      notes: this.drumConfig.openHat,
      pattern,
      subdiv: '16n',
      amp: config.amplitudes.openHat,
      accentLow: config.accents.openHat,
    };

    const clip = ScribbleTune.clip(clipConfig);
    const outputPath = path.join(this.config.outputDir, TRACK_INFO.openHat.filename);
    
    ScribbleTune.midi(clip, outputPath, this.config.bpm);
    console.log(`✅ Generated ${TRACK_INFO.openHat.name}: ${outputPath}`);
  }

  /**
   * Generate crash pattern (bar 1 only)
   */
  public generateCrash(): void {
    const crashBars = 'x---------------' + '-'.repeat(16 * (this.config.bars - 1));
    
    const clipConfig: ClipConfig = {
      notes: this.drumConfig.crash,
      pattern: crashBars,
      subdiv: '16n',
      amp: config.amplitudes.crash,
      accentLow: config.accents.crash,
    };

    const clip = ScribbleTune.clip(clipConfig);
    const outputPath = path.join(this.config.outputDir, TRACK_INFO.crash.filename);
    
    ScribbleTune.midi(clip, outputPath, this.config.bpm);
    console.log(`✅ Generated ${TRACK_INFO.crash.name}: ${outputPath}`);
  }

  /**
   * Generate tom fill pattern (bar 4)
   */
  public generateTomFill(): void {
    const fillRest = '-'.repeat(16 * (this.config.bars - 1)); // bars - 1 bars rest
    const fillBar = '----x-x-x-x-xx-x'; // bar 4 fill pattern
    const fillNotes = [this.drumConfig.tomLow, this.drumConfig.tomMid, this.drumConfig.tomHigh, this.drumConfig.snare];
    const restClip = ScribbleTune.clip({
      notes: this.drumConfig.snare,
      pattern: fillRest,
      subdiv: '16n',
    });

    const fillClip = ScribbleTune.clip({
      notes: fillNotes,
      pattern: fillBar,
      subdiv: '16n',
      amp: config.amplitudes.tomFill,
      accentLow: config.accents.tomFill,
    });

    const combinedClip = restClip.concat(fillClip);
    const outputPath = path.join(this.config.outputDir, TRACK_INFO.tomFill.filename);
    
    ScribbleTune.midi(combinedClip, outputPath, this.config.bpm);
    console.log(`✅ Generated ${TRACK_INFO.tomFill.name}: ${outputPath}`);
  }

  /**
   * Generate all drum patterns
   */
  public generateAll(): void {
    console.log('🥁 Generating drum patterns...');
    this.generateKick();
    this.generateSnare();
    this.generateClosedHat();
    this.generateOpenHat();
    this.generateCrash();
    this.generateTomFill();
    console.log('✅ All drum patterns generated!');
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

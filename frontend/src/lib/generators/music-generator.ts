/**
 * Main music generator orchestrator
 */

import ScribbleTune from 'scribbletune';
import * as fs from 'fs';
import * as path from 'path';
import type { GenerationConfig, ChordProgression } from '../types/music';
import { config, validateConfig } from '../config';
import { DrumGenerator } from './drums';
import { BassGenerator } from './bass';
import { ChordGenerator } from './chords';
import { ArpGenerator } from './arp';
import { LeadGenerator } from './lead';
import { FxGenerator } from './fx';

export class MusicGenerator {
  private config: GenerationConfig;
  private drumGenerator!: DrumGenerator;
  private bassGenerator!: BassGenerator;
  private chordGenerator!: ChordGenerator;
  private arpGenerator!: ArpGenerator;
  private leadGenerator!: LeadGenerator;
  private fxGenerator!: FxGenerator;

  constructor(customConfig?: Partial<GenerationConfig>) {
    // Use environment config as base, then override with custom config
    this.config = { ...config.generation, ...customConfig };
    this.initializeGenerators();
  }

  /**
   * Initialize all generators
   */
  private initializeGenerators(): void {
    this.drumGenerator = new DrumGenerator(this.config);
    this.bassGenerator = new BassGenerator(this.config);
    this.chordGenerator = new ChordGenerator(this.config);
    this.arpGenerator = new ArpGenerator(this.config);
    this.leadGenerator = new LeadGenerator(this.config);
    this.fxGenerator = new FxGenerator(this.config);
  }

  /**
   * Initialize chord progression using ScribbleTune
   */
  private initializeChordProgression(): void {
    const chords = ScribbleTune.getChordsByProgression(
      this.config.chordProgression.scaleKey,
      this.config.chordProgression.progression
    );
    
    // Split the chord string into individual chords and clean them up
    const chordString = Array.isArray(chords) ? chords.join(' ') : chords;
    const chordArray = chordString.split(' ').map(chord => chord.trim()).filter(chord => chord !== '');
    
    const cleanChords = chordArray.map(chord => {
      // Remove octave numbers and clean up chord names for ScribbleTune compatibility
      return chord.replace(/_\d+$/, '').replace(/_/g, '').trim();
    }).filter(chord => chord.length > 0);
    
    this.config.chordProgression.chords = cleanChords;
    console.log(`🎵 Chord progression: ${this.config.chordProgression.scaleKey} - ${this.config.chordProgression.progression}`);
    console.log(`🎵 Chords: ${cleanChords.join(', ')}`);
  }

  /**
   * Generate all musical elements
   */
  public async generateAll(): Promise<void> {
    try {
      // Validate configuration
      validateConfig(config);

      console.log('🎵 ScribbleTune02 - Music Generation Project');
      console.log('==========================================');
      console.log(`🎵 BPM: ${this.config.bpm}`);
      console.log(`🎵 Bars: ${this.config.bars}`);
      console.log(`🎵 Output: ${this.config.outputDir}`);
      console.log(`🎵 Environment: ${config.development.nodeEnv}`);
      console.log('');

      // Initialize chord progression
      this.initializeChordProgression();

      // Ensure output directory exists
      this.ensureOutputDir();

      // Generate all musical elements
      console.log('🥁 Generating drums...');
      this.drumGenerator.generateAll();

      console.log('🎸 Generating bass...');
      this.bassGenerator.generateBass();

      console.log('🎹 Generating chords...');
      this.chordGenerator.generateAll();

      console.log('🎼 Generating arpeggio...');
      this.arpGenerator.generateArp();

      console.log('🎺 Generating lead...');
      this.leadGenerator.generateLead();

      console.log('💥 Generating FX...');
      this.fxGenerator.generateFxCrash();

      console.log('');
      console.log(`✅ Exported full synthwave kit at ${this.config.bpm} BPM → ${this.config.outputDir}`);
      console.log('🎵 Ready for your DAW!');

    } catch (error) {
      console.error('❌ Error generating music:', error);
      throw error;
    }
  }

  /**
   * Generate specific element
   */
  public generateDrums(): void {
    this.drumGenerator.generateAll();
  }

  public generateBass(): void {
    this.bassGenerator.generateBass();
  }

  public generateChords(): void {
    this.chordGenerator.generateAll();
  }

  public generateArp(): void {
    this.arpGenerator.generateArp();
  }

  public generateLead(): void {
    this.leadGenerator.generateLead();
  }

  public generateFx(): void {
    this.fxGenerator.generateFxCrash();
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<GenerationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.initializeGenerators();
  }

  /**
   * Get current configuration
   */
  public getConfig(): GenerationConfig {
    return { ...this.config };
  }

  /**
   * Ensure output directory exists
   */
  private ensureOutputDir(): void {
    try {
      // Try multiple possible paths for the output directory
      const possiblePaths = [
        this.config.outputDir,
        path.join(process.cwd(), this.config.outputDir),
        path.join(process.cwd(), '..', this.config.outputDir),
        path.join(process.cwd(), 'frontend', this.config.outputDir)
      ];
      
      let outputPath: string | null = null;
      
      for (const possiblePath of possiblePaths) {
        try {
          if (!fs.existsSync(possiblePath)) {
            fs.mkdirSync(possiblePath, { recursive: true });
          }
          outputPath = possiblePath;
          break;
        } catch (err) {
          // Continue to next path
          continue;
        }
      }
      
      if (!outputPath) {
        throw new Error(`Could not create output directory: ${this.config.outputDir}`);
      }
      
      // Update the config with the actual path used
      this.config.outputDir = outputPath;
    } catch (error) {
      console.error('Error creating output directory:', error);
      throw error;
    }
  }
}

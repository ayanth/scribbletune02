import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { MusicGenerator } from '$lib/generators/music-generator';
import { loadConfig } from '$lib/config';

export const POST: RequestHandler = async () => {
  try {
    // Load current configuration from db.json
    const currentConfig = loadConfig();
    const generator = new MusicGenerator({
      outputDir: currentConfig.generation.outputDir,
      bpm: currentConfig.generation.bpm,
      bars: currentConfig.generation.bars,
      chordProgression: currentConfig.chordProgression,
      drumConfig: currentConfig.drum
    });
    
    await generator.generateAll();
    
    return json({ 
      message: 'All music generated successfully',
      tracks: ['kick', 'snare', 'closedHat', 'openHat', 'crash', 'tomFill', 'bass', 'chordsPads', 'chordsPlucks', 'arp', 'lead', 'fxCrash'],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating music:', error);
    return json({ error: 'Failed to generate music' }, { status: 500 });
  }
};

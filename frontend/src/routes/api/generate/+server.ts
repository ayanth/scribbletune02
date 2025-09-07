import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { MusicGenerator } from '$lib/generators/music-generator';

export const POST: RequestHandler = async () => {
  try {
    const generator = new MusicGenerator();
    
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

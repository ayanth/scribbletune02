import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { MusicGenerator } from '$lib/generators/music-generator';

export const POST: RequestHandler = async ({ params }) => {
  try {
    const { instrument } = params;
    const generator = new MusicGenerator();
    
    // Validate instrument name
    const validInstruments = ['kick', 'snare', 'closedHat', 'openHat', 'crash', 'tomFill', 'bass', 'chordsPads', 'chordsPlucks', 'arp', 'lead', 'fxCrash'];
    
    if (!validInstruments.includes(instrument)) {
      return json({ 
        error: 'Invalid instrument', 
        validInstruments 
      }, { status: 400 });
    }
    
    // Generate specific instrument
    switch (instrument) {
      case 'kick':
      case 'snare':
      case 'closedHat':
      case 'openHat':
      case 'crash':
      case 'tomFill':
        generator.generateDrums();
        break;
      case 'bass':
        generator.generateBass();
        break;
      case 'chordsPads':
      case 'chordsPlucks':
        generator.generateChords();
        break;
      case 'arp':
        generator.generateArp();
        break;
      case 'lead':
        generator.generateLead();
        break;
      case 'fxCrash':
        generator.generateFx();
        break;
    }
    
    return json({ 
      message: `${instrument} generated successfully`,
      instrument,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error generating ${params.instrument}:`, error);
    return json({ error: `Failed to generate ${params.instrument}` }, { status: 500 });
  }
};

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  console.log('=== CONFIG API ROUTE CALLED ===');
  
  const config = {
    generation: {
      bpm: 110,
      bars: 4,
      outputDir: 'duo/full/'
    },
    drum: {
      kick: 'C1',
      snare: 'D1',
      closedHat: 'F#1',
      openHat: 'A#1',
      crash: 'C#2',
      tomLow: 'F1',
      tomMid: 'A1',
      tomHigh: 'C2'
    },
    chordProgression: {
      scaleKey: 'C minor',
      progression: 'I vi IV V',
      chords: [],
      bassRoots: ['C2', 'Ab1', 'Eb2', 'Bb1']
    },
    amplitudes: {
      kick: 115, snare: 118, closedHat: 100, openHat: 110, crash: 120,
      tomFill: 115, bass: 115, chordsPads: 115, chordsPlucks: 110,
      arp: 110, lead: 115, fxCrash: 120
    },
    accents: {
      kick: 90, snare: 95, closedHat: 80, openHat: 90, crash: 100,
      tomFill: 95, bass: 90, chordsPads: 95, chordsPlucks: 85,
      arp: 85, lead: 90, fxCrash: 100
    },
    arp: {
      count: 4,
      order: '0123',
      notes: ['C4', 'Eb4', 'G4', 'Bb4', 'C5', 'Bb4', 'G4', 'Eb4']
    },
    lead: {
      notes: ['C5', 'Eb5', 'G5', 'Bb5', 'G5', 'Eb5', 'C5', 'Bb4', 'C5', 'Eb5', 'G5', 'Eb5', 'C5', 'Bb4']
    },
    development: {
      nodeEnv: 'development',
      logLevel: 'info'
    },
    filenames: {
      kick: '01a_kick.mid', snare: '01b_snare.mid', closedHat: '01c_ch.mid',
      openHat: '01d_oh.mid', crash: '01e_crash.mid', tomFill: '01f_fill.mid',
      bass: '02_bass.mid', chordsPads: '03_chords_pads.mid', chordsPlucks: '04_chords_plucks.mid',
      arp: '05_arp.mid', lead: '06_lead.mid', fxCrash: '07_fx_crash.mid'
    }
  };
  
  console.log('Returning config:', config);
  return json(config);
};

export const PUT: RequestHandler = async ({ request }) => {
  try {
    const newConfig = await request.json();
    
    // Validate the configuration
    if (!newConfig.generation || !newConfig.drum || !newConfig.chordProgression) {
      return json({ error: 'Invalid configuration structure' }, { status: 400 });
    }
    
    // For now, just return success (we'll add saving later)
    console.log('Config update received:', newConfig);
    
    return json({ 
      message: 'Configuration updated successfully', 
      config: newConfig 
    });
  } catch (error) {
    console.error('Error updating configuration:', error);
    return json({ error: 'Failed to update configuration' }, { status: 500 });
  }
};

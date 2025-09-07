/**
 * Musical constants and configuration
 * Note: Default values are now loaded from environment variables via config loader
 */

import { DrumConfig, ChordProgression, GenerationConfig, TrackInfo } from './music';

export const TRACK_INFO: Record<string, TrackInfo> = {
  kick: {
    name: 'Kick',
    filename: '01a_kick.mid',
    description: 'Four-on-the-floor kick pattern',
    abletonInstrument: 'Drum Rack → Core 808/909 kit',
    fxChain: [
      'EQ Eight → HP @ 25–30 Hz; gentle +2 dB @ ~60 Hz',
      'Saturator → Analog Clip, Drive ~ +3 dB',
      'Compressor → 2:1, slow release'
    ]
  },
  snare: {
    name: 'Snare',
    filename: '01b_snare.mid',
    description: 'Snare on 2 & 4',
    abletonInstrument: 'Drum Rack → 808/909 Snare',
    fxChain: [
      'Reverb → Small Plate, 0.8–1.4 s, Wet 20–25%',
      'Overdrive → light; focus 200 Hz–2 kHz',
      'EQ Eight → dip 250–300 Hz if boxy'
    ]
  },
  closedHat: {
    name: 'Closed Hat',
    filename: '01c_ch.mid',
    description: 'Closed hats on off-beats',
    abletonInstrument: 'Drum Rack → Closed Hat',
    fxChain: [
      'Chorus-Ensemble → "Classic", subtle width',
      'Auto Filter → HP ~300 Hz, slight resonance',
      'Delay (optional) → 1/16 dotted, Feedback ~15%'
    ]
  },
  openHat: {
    name: 'Open Hat',
    filename: '01d_oh.mid',
    description: 'Open hats on 2 & 4',
    abletonInstrument: 'Drum Rack → Open Hat',
    fxChain: [
      'Reverb → Short Plate, 15–20% Wet',
      'EQ Eight → HP < 200 Hz, gentle shelf @ 8–10 kHz'
    ]
  },
  crash: {
    name: 'Crash',
    filename: '01e_crash.mid',
    description: 'Crash on bar 1 only',
    abletonInstrument: 'Drum Rack → Crash Cymbal',
    fxChain: [
      'Reverb → Big Hall, Decay 6–8 s, Wet 40–50%',
      'EQ Eight → HP < 200 Hz'
    ]
  },
  tomFill: {
    name: 'Tom Fill',
    filename: '01f_fill.mid',
    description: 'Tom fill in bar 4',
    abletonInstrument: 'Drum Rack → Low/Mid/High Tom cells',
    fxChain: [
      'Saturator → Soft Sine, Drive +2 dB',
      'Reverb → Small Room, Wet 15–20%'
    ]
  },
  bass: {
    name: 'Bass',
    filename: '02_bass.mid',
    description: 'Bass with pulsing 1/8 notes',
    abletonInstrument: 'Drift (or Simpler with single-cycle saw sample)',
    fxChain: [
      'Saturator → Soft Sine, +2 dB Drive',
      'Compressor → Fast attack, medium release'
    ]
  },
  chordsPads: {
    name: 'Chords Pads',
    filename: '03_chords_pads.mid',
    description: 'Chord pads with whole notes',
    abletonInstrument: 'Drift layered in Instrument Rack',
    fxChain: [
      'Chorus-Ensemble → "Wide"',
      'Reverb → Hall, Decay ~8 s, Wet ~40%',
      'Utility → Width ~150%'
    ]
  },
  chordsPlucks: {
    name: 'Chords Plucks',
    filename: '04_chords_plucks.mid',
    description: 'Gated chord plucks on 1/8',
    abletonInstrument: 'Drift (groovy pluck) or Simpler',
    fxChain: [
      'Delay → 1/8 dotted, Feedback ~25%',
      'Reverb → Plate, Decay ~3 s'
    ]
  },
  arp: {
    name: 'Arp',
    filename: '05_arp.mid',
    description: '16th ascending arpeggio',
    abletonInstrument: 'Drift (bright saw/square pluck)',
    fxChain: [
      'Chorus-Ensemble → light shimmer',
      'Ping Pong Delay → 1/16, Feedback ~20%',
      'Reverb → Hall, ~4 s'
    ]
  },
  lead: {
    name: 'Lead',
    filename: '06_lead.mid',
    description: 'Lead melody with rests',
    abletonInstrument: 'Drift (square+saw) or Simpler',
    fxChain: [
      'Phaser-Flanger → slow sweep',
      'Delay → 1/4, Feedback ~25%',
      'Reverb → Hall, 5 s, Wet ~35%'
    ]
  },
  fxCrash: {
    name: 'FX Crash',
    filename: '07_fx_crash.mid',
    description: 'Big entrance crash',
    abletonInstrument: 'Drum Rack Crash',
    fxChain: [
      'Reverb → Huge Hall, Decay 8–10 s, Wet ~50%',
      'EQ Eight → HP < 200 Hz'
    ]
  }
};

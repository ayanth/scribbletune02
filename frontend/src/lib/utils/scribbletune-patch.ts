/**
 * ScribbleTune Monkey Patch
 * Patches ScribbleTune.midi to automatically add track names to generated MIDI files
 */

import ScribbleTune from 'scribbletune';
import { processMidiFileWithTrackName } from './midi-track-namer';

/**
 * Original ScribbleTune.midi function (stored before patching)
 */
let originalMidiFunction: typeof ScribbleTune.midi;

/**
 * Patched ScribbleTune.midi function that adds track names
 */
function patchedMidiFunction(clip: any, outputPath: string, bpm?: number, trackName?: string): void {
  // Call the original ScribbleTune.midi function
  originalMidiFunction.call(ScribbleTune, clip, outputPath, bpm);
  
  // Add track name to the generated MIDI file
  try {
    const finalTrackName = trackName || extractTrackNameFromPath(outputPath);
    processMidiFileWithTrackName(outputPath, finalTrackName);
  } catch (error) {
    console.warn(`⚠️  Warning: Could not add track name to ${outputPath}:`, error);
    // Don't throw - the MIDI file was still generated successfully
  }
}

/**
 * Extracts a track name from the output path
 */
function extractTrackNameFromPath(outputPath: string): string {
  const pathParts = outputPath.split('/');
  const filename = pathParts[pathParts.length - 1];
  
  // Remove .mid extension and convert to readable name
  const nameWithoutExt = filename.replace(/\.mid$/i, '');
  
  // Convert snake_case or kebab-case to Title Case
  return nameWithoutExt
    .split(/[_-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Applies the monkey patch to ScribbleTune.midi
 */
export function patchScribbleTune(): void {
  if (!originalMidiFunction) {
    // Store the original function
    originalMidiFunction = ScribbleTune.midi;
    
    // Replace with our patched version
    ScribbleTune.midi = patchedMidiFunction as typeof ScribbleTune.midi;
    
    console.log('✅ ScribbleTune.midi has been patched to include track names');
  }
}

/**
 * Restores the original ScribbleTune.midi function
 */
export function unpatchScribbleTune(): void {
  if (originalMidiFunction) {
    ScribbleTune.midi = originalMidiFunction;
    originalMidiFunction = undefined as any;
    console.log('✅ ScribbleTune.midi has been restored to original function');
  }
}

/**
 * Enhanced ScribbleTune.midi function with explicit track name support
 * This provides a cleaner API for generators that want to specify track names
 */
export function scribbleTuneMidiWithTrackName(
  clip: any, 
  outputPath: string, 
  bpm?: number, 
  trackName?: string
): void {
  // Call the original ScribbleTune.midi function
  originalMidiFunction.call(ScribbleTune, clip, outputPath, bpm);
  
  // Add track name to the generated MIDI file
  try {
    const finalTrackName = trackName || extractTrackNameFromPath(outputPath);
    processMidiFileWithTrackName(outputPath, finalTrackName);
  } catch (error) {
    console.warn(`⚠️  Warning: Could not add track name to ${outputPath}:`, error);
    // Don't throw - the MIDI file was still generated successfully
  }
}

/**
 * Auto-patch ScribbleTune when this module is imported
 */
patchScribbleTune();


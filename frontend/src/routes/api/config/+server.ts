import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadConfig, saveConfig, type AppConfig } from '$lib/config';

export const GET: RequestHandler = async () => {
  try {
    const config = loadConfig();
    return json(config);
  } catch (error) {
    console.error('Error loading configuration:', error);
    return json({ error: 'Failed to load configuration' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request }) => {
  try {
    const newConfig: AppConfig = await request.json();
    
    // Validate the configuration
    if (!newConfig.generation || !newConfig.drum || !newConfig.chordProgression) {
      return json({ error: 'Invalid configuration structure' }, { status: 400 });
    }
    
    // Save the configuration
    saveConfig(newConfig);
    
    return json({ 
      message: 'Configuration updated successfully', 
      config: newConfig 
    });
  } catch (error) {
    console.error('Error updating configuration:', error);
    return json({ error: 'Failed to update configuration' }, { status: 500 });
  }
};

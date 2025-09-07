import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  console.log('=== HEALTH API ROUTE CALLED ===');
  return json({ 
    status: 'ok', 
    healthy: true, 
    timestamp: new Date().toISOString() 
  });
};

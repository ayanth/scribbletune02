<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import type { AppConfig } from '$lib/config';
	
	let isConnected: boolean = false;
	let musicData: any = null;
	let error: string | null = null;
	let generatingInstrument: string | null = null;
	let generationStatus: string | null = null;
	let config: AppConfig | null = null;
	let loading: boolean = true;
	let saving: boolean = false;
	let progressionType: string = 'common';
	let customProgression: string = '';
	let progressionError: string | null = null;
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;
	
	// Accordion state - all sections closed by default
	let openSections: string[] = [];
	
	// Toggle accordion section
	function toggleSection(sectionName: string) {
		// Force reactivity by creating a new array
		const newOpenSections = [...openSections];
		
		if (newOpenSections.includes(sectionName)) {
			// Remove the section
			const index = newOpenSections.indexOf(sectionName);
			newOpenSections.splice(index, 1);
		} else {
			// Add the section
			newOpenSections.push(sectionName);
		}
		
		openSections = newOpenSections;
	}
	
	// Check if section is open
	function isSectionOpen(sectionName: string): boolean {
		return openSections.includes(sectionName);
	}
	
	// Create reactive derived values for each section
	$: drumsOpen = openSections.includes('Drums');
	$: bassOpen = openSections.includes('Bass');
	$: chordsOpen = openSections.includes('Chords');
	$: melodicOpen = openSections.includes('Melodic');
	$: effectsOpen = openSections.includes('Effects');

	// Common chord progressions
	const commonProgressions = [
		{ name: 'I-V-vi-IV (Pop)', value: 'I V vi IV' },
		{ name: 'vi-IV-I-V (Pop)', value: 'vi IV I V' },
		{ name: 'I-vi-IV-V (50s)', value: 'I vi IV V' },
		{ name: 'i-VI-III-VII (Minor)', value: 'i VI III VII' },
		{ name: 'I-IV-V (Blues)', value: 'I IV V' },
		{ name: 'ii-V-I (Jazz)', value: 'ii V I' },
		{ name: 'I-vi-ii-V (Jazz)', value: 'I vi ii V' },
		{ name: 'vi-V-IV-V (Pop)', value: 'vi V IV V' },
		{ name: 'I-V-vi-iii-IV-I-IV-V (Pachelbel)', value: 'I V vi iii IV I IV V' },
		{ name: 'i-bVII-bVI-bVII (Minor)', value: 'i bVII bVI bVII' }
	];

	// Instrument categories with their configurations
	const instrumentCategories = [
		{
			name: 'Drums',
			icon: '🥁',
			instruments: [
				{ id: 'kick', name: 'Kick', icon: '🥁', config: ['drum', 'amplitudes', 'accents', 'filenames'] },
				{ id: 'snare', name: 'Snare', icon: '🥁', config: ['drum', 'amplitudes', 'accents', 'filenames'] },
				{ id: 'closedHat', name: 'Closed Hat', icon: '🥁', config: ['drum', 'amplitudes', 'accents', 'filenames'] },
				{ id: 'openHat', name: 'Open Hat', icon: '🥁', config: ['drum', 'amplitudes', 'accents', 'filenames'] },
				{ id: 'crash', name: 'Crash', icon: '🥁', config: ['drum', 'amplitudes', 'accents', 'filenames'] },
				{ id: 'tomFill', name: 'Tom Fill', icon: '🥁', config: ['drum', 'amplitudes', 'accents', 'filenames'] }
			]
		},
		{
			name: 'Bass',
			icon: '🎸',
			instruments: [
				{ id: 'bass', name: 'Bass', icon: '🎸', config: ['amplitudes', 'accents', 'filenames'] }
			]
		},
		{
			name: 'Chords',
			icon: '🎹',
			instruments: [
				{ id: 'chordsPads', name: 'Chords Pads', icon: '🎹', config: ['amplitudes', 'accents', 'filenames'] },
				{ id: 'chordsPlucks', name: 'Chords Plucks', icon: '🎹', config: ['amplitudes', 'accents', 'filenames'] }
			]
		},
		{
			name: 'Melodic',
			icon: '🎼',
			instruments: [
				{ id: 'arp', name: 'Arpeggio', icon: '🎼', config: ['arp', 'amplitudes', 'accents', 'filenames'] },
				{ id: 'lead', name: 'Lead', icon: '🎺', config: ['lead', 'amplitudes', 'accents', 'filenames'] }
			]
		},
		{
			name: 'Effects',
			icon: '💥',
			instruments: [
				{ id: 'fxCrash', name: 'FX Crash', icon: '💥', config: ['amplitudes', 'accents', 'filenames'] }
			]
		}
	];

	onMount(async () => {
		console.log('Page mounted, starting initialization...');
		try {
			await Promise.all([loadConfig(), checkBackendStatus()]);
		} catch (error) {
			console.error('Error during initialization:', error);
		}
	});

	async function loadConfig() {
		try {
			loading = true;
			error = null;
			const response = await fetch('/api/config');
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			config = await response.json();
			
			// Initialize progression type and custom progression
			if (config && config.chordProgression && config.chordProgression.progression) {
				const currentProgression = config.chordProgression.progression;
				const isCommonProgression = commonProgressions.some(p => p.value === currentProgression);
				
				if (isCommonProgression) {
					progressionType = 'common';
				} else {
					progressionType = 'custom';
					customProgression = currentProgression;
				}
			}
		} catch (err) {
			error = (err as Error).message;
			console.error('Error loading configuration:', err);
		} finally {
			loading = false;
		}
	}

	async function saveConfig() {
		try {
			saving = true;
			error = null;
			
			// Check for progression validation error
			if (progressionType === 'custom' && progressionError) {
				error = 'Please fix the chord progression format before saving.';
				return;
			}
			
			const response = await fetch('/api/config', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(config)
			});
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const result = await response.json();
			console.log('Configuration saved:', result);
		} catch (err) {
			error = (err as Error).message;
			console.error('Error saving configuration:', err);
		} finally {
			saving = false;
		}
	}

	// Auto-save function with debouncing
	function autoSave() {
		// Clear existing timeout
		if (saveTimeout) {
			clearTimeout(saveTimeout);
		}
		
		// Set new timeout for auto-save (500ms delay)
		saveTimeout = setTimeout(async () => {
			await saveConfig();
		}, 500);
	}

	// Handle any config change for auto-save
	function handleConfigChange() {
		if (config && !loading) {
			autoSave();
		}
	}

	async function generateMusic() {
		try {
			error = null;
			
			// First check if backend is available
			await checkBackendStatus();
			if (!isConnected) {
				throw new Error('Music generation service is not available.');
			}
			
			const response = await fetch('/api/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			musicData = await response.json();
		} catch (err) {
			error = (err as Error).message;
			console.error('Error generating music:', err);
		}
	}

	async function checkBackendStatus() {
		console.log('Checking backend status...');
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5000);
			
			try {
				console.log('Making request to /api/health...');
				const response = await fetch('/api/health', {
					method: 'GET',
					signal: controller.signal
				});
				clearTimeout(timeoutId);
				console.log('Health response status:', response.status);
			
			if (response.ok) {
				const data = await response.json();
				isConnected = data.status === 'ok' || data.healthy === true;
				} else {
					isConnected = false;
				}
			} catch (fetchErr) {
				clearTimeout(timeoutId);
				throw fetchErr;
			}
		} catch (err) {
			console.log('Backend not available:', (err as Error).message);
			isConnected = false;
		}
	}

	// Individual instrument generation
	async function generateInstrument(instrument: string) {
		try {
			error = null;
			generatingInstrument = instrument;
			generationStatus = `Generating ${instrument}...`;
			
			const response = await fetch(`/api/generate/${instrument}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const result = await response.json();
			generationStatus = `${instrument} generated successfully!`;
			
			// Clear status after 3 seconds
			setTimeout(() => {
				generationStatus = null;
			}, 3000);
		} catch (err) {
			error = (err as Error).message;
			console.error(`Error generating ${instrument}:`, err);
		} finally {
			generatingInstrument = null;
		}
	}

	// Validate roman numerals format
	function validateRomanNumerals(progression: string): boolean {
		const validChords = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'bI', 'bII', 'bIII', 'bIV', 'bV', 'bVI', 'bVII', '#I', '#II', '#III', '#IV', '#V', '#VI', '#VII'];
		
		const chords = progression.trim().split(/\s+/);
		return chords.every(chord => validChords.includes(chord));
	}

	// Handle progression type change
	function handleProgressionTypeChange() {
		progressionError = null;
		if (progressionType === 'common') {
			// Set to first common progression by default
			if (config && config.chordProgression) {
				config.chordProgression.progression = commonProgressions[0].value;
			}
		} else {
			// Switch to custom input
			if (config && config.chordProgression) {
				config.chordProgression.progression = customProgression;
			}
		}
		// Auto-save the change
		handleConfigChange();
	}

	// Handle common progression selection
	function handleCommonProgressionChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		if (config && config.chordProgression) {
			config.chordProgression.progression = target.value;
		}
		progressionError = null;
		// Auto-save the change
		handleConfigChange();
	}

	// Handle custom progression input
	function handleCustomProgressionInput(event: Event) {
		const target = event.target as HTMLInputElement;
		customProgression = target.value;
		
		if (config && config.chordProgression) {
			config.chordProgression.progression = customProgression;
		}
		
		// Validate roman numerals
		if (customProgression.trim()) {
			if (!validateRomanNumerals(customProgression)) {
				progressionError = 'Invalid format. Use roman numerals (e.g., I V vi IV)';
			} else {
				progressionError = null;
			}
		} else {
			progressionError = null;
		}
		
		// Auto-save if no validation errors
		if (!progressionError) {
			autoSave();
		}
	}

	function resetConfig() {
		if (confirm('Are you sure you want to reset all configuration to default values?')) {
			loadConfig();
		}
	}

	function handleLeadNotesChange(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		config.lead.notes = target.value.split(' ').filter((n: string) => n.trim());
		handleConfigChange();
	}
</script>

<svelte:head>
	<title>ScribbleTune02 - AI Music Generator</title>
</svelte:head>

<div class="container">
	<div class="header">
		<h1>🎵 ScribbleTune02</h1>
		<p class="subtitle">AI-Powered Music Generation & Configuration</p>
		
		<div class="status">
			<div class="status-item">
				<span class="status-label">Backend Status:</span>
				<span class="status-value {isConnected ? 'connected' : 'disconnected'}">
					{isConnected ? '🟢 Connected' : '🔴 Disconnected'}
				</span>
				<button class="refresh-btn" on:click={checkBackendStatus}>
					🔄 Refresh
				</button>
			</div>
		</div>

		{#if error}
			<div class="error">
				<p>❌ Error: {error}</p>
			</div>
		{/if}


		{#if musicData}
			<div class="success">
				<h3>✅ Music Generated Successfully!</h3>
				<p>Generated {musicData.tracks?.length || 0} tracks</p>
			</div>
		{/if}

		{#if generationStatus}
			<div class="generation-status">
				<p>🎵 {generationStatus}</p>
			</div>
		{/if}

		<div class="global-actions">
			<button 
				class="generate-all-btn" 
				on:click={generateMusic}
				disabled={!isConnected}
			>
				{isConnected ? '🎵 Generate All Music' : '⏳ Backend Not Available'}
			</button>
			
			<button class="btn btn-secondary" on:click={loadConfig} disabled={loading}>
				{loading ? '⏳ Loading...' : '🔄 Reload Config'}
			</button>
			
			<button class="btn btn-warning" on:click={resetConfig} disabled={loading || saving}>
				🔄 Reset to Default
			</button>
			
			{#if saving}
				<div class="save-status">
					<span class="saving-indicator">⏳ Auto-saving...</span>
				</div>
			{/if}
		</div>
	</div>

	{#if loading}
		<div class="loading">
			<p>Loading configuration...</p>
		</div>
	{:else if config}
		<!-- Global Settings -->
		<section class="config-section global-settings">
			<h2>🌍 Global Settings</h2>
			<div class="form-grid">
				<div class="form-group">
					<label for="bpm">BPM (Beats Per Minute)</label>
					<input 
						id="bpm" 
						type="number" 
						bind:value={config.generation.bpm} 
						on:input={handleConfigChange}
						min="60" 
						max="200" 
						required
					/>
				</div>
				<div class="form-group">
					<label for="bars">Bars</label>
					<input 
						id="bars" 
						type="number" 
						bind:value={config.generation.bars} 
						on:input={handleConfigChange}
						min="1" 
						max="16" 
						required
					/>
				</div>
				<div class="form-group">
					<label for="outputDir">Output Directory</label>
					<input 
						id="outputDir" 
						type="text" 
						bind:value={config.generation.outputDir} 
						on:input={handleConfigChange}
						required
					/>
				</div>
			</div>
		</section>

		<!-- Chord Progression Settings -->
		<section class="config-section chord-progression">
			<h2>🎼 Chord Progression</h2>
			<div class="form-grid">
				<div class="form-group">
					<label for="scaleKey">Scale Key</label>
					<select id="scaleKey" bind:value={config.chordProgression.scaleKey} on:change={handleConfigChange}>
						<option value="C major">C major</option>
						<option value="C minor">C minor</option>
						<option value="G major">G major</option>
						<option value="G minor">G minor</option>
						<option value="D major">D major</option>
						<option value="D minor">D minor</option>
						<option value="A major">A major</option>
						<option value="A minor">A minor</option>
						<option value="E major">E major</option>
						<option value="E minor">E minor</option>
						<option value="B major">B major</option>
						<option value="B minor">B minor</option>
						<option value="F# major">F# major</option>
						<option value="F# minor">F# minor</option>
						<option value="C# major">C# major</option>
						<option value="C# minor">C# minor</option>
						<option value="F major">F major</option>
						<option value="F minor">F minor</option>
						<option value="Bb major">Bb major</option>
						<option value="Bb minor">Bb minor</option>
						<option value="Eb major">Eb major</option>
						<option value="Eb minor">Eb minor</option>
						<option value="Ab major">Ab major</option>
						<option value="Ab minor">Ab minor</option>
						<option value="Db major">Db major</option>
						<option value="Db minor">Db minor</option>
					</select>
				</div>
				<div class="form-group">
					<label for="progressionType">Progression Type</label>
					<select id="progressionType" bind:value={progressionType} on:change={handleProgressionTypeChange}>
						<option value="common">Common Progressions</option>
						<option value="custom">Custom Progression</option>
					</select>
				</div>
				
				{#if progressionType === 'common'}
					<div class="form-group">
						<label for="commonProgression">Select Progression</label>
						<select id="commonProgression" on:change={handleCommonProgressionChange}>
							{#each commonProgressions as progression}
								<option value={progression.value} selected={config?.chordProgression?.progression === progression.value}>
									{progression.name}
								</option>
							{/each}
						</select>
					</div>
				{:else}
					<div class="form-group">
						<label for="customProgression">Custom Progression</label>
						<input 
							id="customProgression" 
							type="text" 
							bind:value={customProgression}
							on:input={handleCustomProgressionInput}
							placeholder="e.g., I V vi IV"
							class:error={progressionError}
						/>
						{#if progressionError}
							<div class="field-error">{progressionError}</div>
						{/if}
						<div class="field-hint">
							Use roman numerals separated by spaces (e.g., I V vi IV, i VI III VII)
						</div>
					</div>
				{/if}
			</div>
		</section>

		<!-- Instrument Categories -->
		{#each instrumentCategories as category}
			<section class="instrument-category">
				<button 
					class="category-header" 
					on:click={() => toggleSection(category.name)}
					class:open={category.name === 'Drums' ? drumsOpen : category.name === 'Bass' ? bassOpen : category.name === 'Chords' ? chordsOpen : category.name === 'Melodic' ? melodicOpen : effectsOpen}
				>
					<span class="category-title">
						<span class="category-icon">{category.icon}</span>
						{category.name}
					</span>
					<span class="accordion-arrow" class:rotated={category.name === 'Drums' ? drumsOpen : category.name === 'Bass' ? bassOpen : category.name === 'Chords' ? chordsOpen : category.name === 'Melodic' ? melodicOpen : effectsOpen}>
						▼
					</span>
				</button>
				
				{#if category.name === 'Drums' ? drumsOpen : category.name === 'Bass' ? bassOpen : category.name === 'Chords' ? chordsOpen : category.name === 'Melodic' ? melodicOpen : effectsOpen}
					<div class="instruments-grid" transition:slide>
					{#each category.instruments as instrument}
						<div class="instrument-block">
							<div class="instrument-header">
								<div class="instrument-info">
									<span class="instrument-icon">{instrument.icon}</span>
									<h3>{instrument.name}</h3>
								</div>
								<button 
									class="generate-btn" 
									on:click={() => generateInstrument(instrument.id)}
									disabled={!isConnected || generatingInstrument === instrument.id}
								>
									{#if generatingInstrument === instrument.id}
										<span class="generating-spinner">⏳</span>
									{:else}
										🎵 Generate
									{/if}
								</button>
							</div>
							
							<div class="instrument-config">
								{#if instrument.config.includes('drum')}
									<div class="config-group">
										<label>Drum Note</label>
										<input 
											type="text" 
											bind:value={config.drum[instrument.id]} 
											on:input={handleConfigChange}
											placeholder="e.g., C1"
										/>
									</div>
								{/if}
								
								{#if instrument.config.includes('amplitudes')}
									<div class="config-group">
										<label>Amplitude</label>
										<div class="slider-container">
											<input 
												type="range" 
												bind:value={config.amplitudes[instrument.id]} 
												on:input={handleConfigChange}
												min="0" 
												max="127"
												class="slider"
											/>
											<span class="value">{config.amplitudes[instrument.id]}</span>
										</div>
									</div>
								{/if}
								
								{#if instrument.config.includes('accents')}
									<div class="config-group">
										<label>Accent</label>
										<div class="slider-container">
											<input 
												type="range" 
												bind:value={config.accents[instrument.id]} 
												on:input={handleConfigChange}
												min="0" 
												max="127"
												class="slider"
											/>
											<span class="value">{config.accents[instrument.id]}</span>
										</div>
									</div>
								{/if}
								
								{#if instrument.config.includes('filenames')}
									<div class="config-group">
										<label>Filename</label>
										<input 
											type="text" 
											bind:value={config.filenames[instrument.id]} 
											on:input={handleConfigChange}
											placeholder="e.g., 01a_kick.mid"
										/>
									</div>
								{/if}
								
								{#if instrument.config.includes('arp') && instrument.id === 'arp'}
									<div class="config-group">
										<label>Arp Count</label>
										<input 
											type="number" 
											bind:value={config.arp.count} 
											on:input={handleConfigChange}
											min="1" 
											max="8"
										/>
									</div>
									<div class="config-group">
										<label>Arp Order</label>
										<input 
											type="text" 
											bind:value={config.arp.order} 
											on:input={handleConfigChange}
											placeholder="e.g., 0123"
										/>
									</div>
								{/if}
								
								{#if instrument.config.includes('lead') && instrument.id === 'lead'}
									<div class="config-group">
										<label>Lead Notes</label>
										<textarea 
											value={config.lead.notes.join(' ')} 
											on:input={handleLeadNotesChange}
											placeholder="e.g., C5 Eb5 G5 Bb5"
											rows="3"
										></textarea>
									</div>
								{/if}
							</div>
						</div>
					{/each}
					</div>
				{/if}
			</section>
		{/each}
	{/if}
</div>

<style>
	.container {
		width: 100%;
		max-width: 1400px;
		padding: 2rem;
		margin: 0 auto;
	}

	.header {
		text-align: center;
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 3rem;
		margin: 0 0 0.5rem 0;
		background: linear-gradient(135deg, #667eea, #764ba2);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.subtitle {
		font-size: 1.2rem;
		color: #666;
		margin-bottom: 2rem;
	}

	.status {
		margin: 2rem 0;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 10px;
	}

	.status-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.status-label {
		font-weight: 600;
	}

	.status-value.connected {
		color: #28a745;
	}

	.status-value.disconnected {
		color: #dc3545;
	}

	.refresh-btn {
		background: #6c757d;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 5px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: background-color 0.3s ease;
	}

	.refresh-btn:hover {
		background: #5a6268;
	}

	.global-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin: 2rem 0;
		flex-wrap: wrap;
	}

	.generate-all-btn {
		background: linear-gradient(135deg, #667eea, #764ba2);
		color: white;
		border: none;
		padding: 1rem 2rem;
		font-size: 1.1rem;
		border-radius: 50px;
		cursor: pointer;
		transition: all 0.3s ease;
		font-weight: 600;
	}

	.generate-all-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
	}

	.generate-all-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		text-decoration: none;
		display: inline-block;
	}

	.btn-secondary {
		background: #6c757d;
		color: white;
	}

	.btn-secondary:hover:not(:disabled) {
		background: #5a6268;
	}

	.btn-warning {
		background: #ffc107;
		color: #212529;
	}

	.btn-warning:hover:not(:disabled) {
		background: #e0a800;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.error, .success, .generation-status {
		padding: 1rem;
		border-radius: 10px;
		margin: 1rem 0;
		text-align: center;
	}

	.error {
		background: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	.success {
		background: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.generation-status {
		background: #d1ecf1;
		color: #0c5460;
		border: 1px solid #bee5eb;
	}

	.loading {
		text-align: center;
		padding: 2rem;
		background: #f8f9fa;
		color: #666;
		border-radius: 10px;
		margin: 2rem 0;
	}

	.save-status {
		display: flex;
		align-items: center;
		margin-left: 1rem;
	}

	.saving-indicator {
		color: #6c757d;
		font-size: 0.9rem;
		font-style: italic;
	}

	.config-section {
		background: rgba(255, 255, 255, 0.95);
		border-radius: 15px;
		padding: 2rem;
		margin-bottom: 2rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	}

	.config-section h2 {
		margin: 0 0 1.5rem 0;
		color: #333;
		font-size: 1.5rem;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group label {
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #555;
	}

	.form-group input,
	.form-group select,
	.form-group textarea {
		padding: 0.75rem;
		border: 2px solid #e1e5e9;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.3s ease;
	}

	.form-group input:focus,
	.form-group select:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #667eea;
	}

	.field-error {
		color: #dc3545;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	.field-hint {
		color: #6c757d;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	.form-group input.error {
		border-color: #dc3545;
		box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
	}

	.instrument-category {
		margin-bottom: 1rem;
		border: 1px solid #333;
		border-radius: 8px;
		overflow: hidden;
	}
	
	.category-header {
		width: 100%;
		background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
		border: none;
		padding: 1rem 1.5rem;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		transition: all 0.3s ease;
	}
	
	.category-header:hover {
		background: linear-gradient(135deg, #3a3a3a, #2a2a2a);
	}
	
	.category-header.open {
		background: linear-gradient(135deg, #3a3a3a, #2a2a2a);
	}
	
	.category-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.5rem;
		font-weight: 600;
		color: #e0e0e0;
	}
	
	.category-icon {
		font-size: 1.8rem;
	}
	
	.accordion-arrow {
		font-size: 1.2rem;
		color: #888;
		transition: transform 0.3s ease;
	}
	
	.accordion-arrow.rotated {
		transform: rotate(180deg);
	}

	.instruments-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 2rem;
		padding: 1.5rem;
		background: #1a1a1a;
	}

	.instrument-block {
		background: rgba(255, 255, 255, 0.95);
		border-radius: 15px;
		padding: 1.5rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease;
	}

	.instrument-block:hover {
		transform: translateY(-2px);
	}

	.instrument-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid #e1e5e9;
	}

	.instrument-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.instrument-icon {
		font-size: 2rem;
	}

	.instrument-info h3 {
		margin: 0;
		font-size: 1.3rem;
		color: #333;
	}

	.generate-btn {
		background: linear-gradient(135deg, #28a745, #20c997);
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 25px;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.generate-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
	}

	.generate-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.generating-spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.instrument-config {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.config-group {
		display: flex;
		flex-direction: column;
	}

	.config-group label {
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #555;
		font-size: 0.9rem;
	}

	.config-group input,
	.config-group textarea {
		padding: 0.5rem;
		border: 2px solid #e1e5e9;
		border-radius: 6px;
		font-size: 0.9rem;
		transition: border-color 0.3s ease;
	}

	.config-group input:focus,
	.config-group textarea:focus {
		outline: none;
		border-color: #667eea;
	}

	.slider-container {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.slider {
		flex: 1;
		-webkit-appearance: none;
		appearance: none;
		height: 6px;
		background: #e1e5e9;
		border-radius: 3px;
		outline: none;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		background: #667eea;
		border-radius: 50%;
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: #667eea;
		border-radius: 50%;
		cursor: pointer;
		border: none;
	}

	.value {
		font-weight: 600;
		color: #667eea;
		min-width: 3rem;
		text-align: center;
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}
		
		.instruments-grid {
			grid-template-columns: 1fr;
		}
		
		.instrument-header {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}
		
		.global-actions {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
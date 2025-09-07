# ScribbleTune02 🎵

AI-powered music generation with ScribbleTune, built with SvelteKit.

## Quick Start

### Option 1: Using Make (Linux/macOS/WSL)
```bash
# Install dependencies
make install

# Start development server
make dev

# Build for production
make build

# See all available commands
make help
```

### Option 2: Using PowerShell Scripts (Windows)
```powershell
# Install dependencies
.\scripts\install.ps1

# Start development server
.\scripts\dev.ps1

# Build for production
.\scripts\build.ps1

# Start with Docker
.\scripts\docker-up.ps1
```

### Option 3: Using npm directly
```bash
# Install dependencies
cd frontend && npm install

# Start development server
cd frontend && npm run dev

# Build for production
cd frontend && npm run build
```

## Available Commands

### Development
- `make dev` / `.\scripts\dev.ps1` - Start development server
- `make install` / `.\scripts\install.ps1` - Install dependencies
- `make build` / `.\scripts\build.ps1` - Build for production
- `make preview` - Preview production build
- `make clean` - Clean build artifacts

### Docker
- `make docker-up` / `.\scripts\docker-up.ps1` - Start Docker containers
- `make docker-down` / `.\scripts\docker-down.ps1` - Stop Docker containers
- `make docker-build` - Build Docker image
- `make docker-logs` - Show Docker logs

### Music Generation
- `make generate` - Generate music (requires dev server running)
- `make health` - Check if server is running
- `make config` - Open configuration in browser

## Features

- 🎵 **AI Music Generation** - Generate MIDI files using ScribbleTune
- 🥁 **Drum Patterns** - Kick, snare, hats, crash, and tom fills
- 🎸 **Bass Lines** - Rhythmic bass patterns
- 🎹 **Chord Progressions** - Pads and plucks
- 🎼 **Arpeggios** - Ascending patterns
- 🎺 **Lead Melodies** - Expressive lead lines
- 💥 **FX** - Crash effects and transitions

## Configuration

Visit `/config` to adjust:
- BPM (Beats Per Minute)
- Number of bars
- Output directory
- Chord progressions
- Instrument settings

## Generated Files

Music is generated in the `duo/` directory with the following structure:
```
duo/
├── 01a_kick.mid
├── 01b_snare.mid
├── 01c_ch.mid
├── 01d_oh.mid
├── 01e_crash.mid
├── 01f_fill.mid
├── 02_bass.mid
├── 03_chords_pads.mid
├── 04_chords_plucks.mid
├── 05_arp.mid
├── 06_lead.mid
└── 07_fx_crash.mid
```

## Development

The project uses:
- **SvelteKit** - Full-stack web framework
- **ScribbleTune** - Music generation library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Docker Deployment

```bash
# Build and start with Docker
make docker-up

# Or manually
docker-compose up -d
```

The application will be available at `http://localhost:3000`

## License

MIT License - see LICENSE file for details.
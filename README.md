# SpaceX Launchpad Explorer

A technical dashboard for exploring SpaceX launch facilities and tracking the Artemis mission, built with Angular, @angular Material table, and Tailwind CSS.

## Features

- **Artemis Mission Tracking**: Real-time countdown to the next upcoming Artemis mission (Artemis II, III, etc.) with dynamic mission patches, Wikipedia links, and Zurich timezone support.
- **Launchpad Explorer**: Fetches and displays the latest launchpad information from the SpaceX API with advanced data grid features.
- **Data Resiliency**: Intelligent fallback logic for mission descriptions and countdown timers using multiple data points (win_open, t0, mission descriptions).
- **Advanced Material Table Grid**: Powered by @angular Material table, offers filtering, and pagination.
- **Mission Control UI**: A sleek, dark-themed interface inspired by aerospace telemetry systems.
- **Responsive Design**: Optimized for both desktop and mobile viewing with a modern, technical aesthetic.
- **Modular Architecture**: Clean separation of concerns with dedicated components for mission tracking and data exploration.

## Enviroment requirement

node.js version : v24.14.1
use n to swtich between versions https://codeforgeek.com/update-node-using-n/

## Setup

1. **Install**:
   ```bash
   npm install
   ```
2. **Envionment**:
   copy environment.example.ts and rename to environment.ts (verify the information: api urls(spaceX, fdo.rocketlaunch.live...))
   **Map your GitHub Secrets to environment variables for this step**

3. **Run Development Server**:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

4. **Build for Production**:
   ```bash
   npm run production
   ```

## Lint

```bash
   npm run lint
```

## Format

```bash
   npm run format
```

## Testing

```bash
npm test
```

## Technical Stack

- **Framework**: Angular (Zoneless)
- **Grid**: Material table
- **Styling**: Tailwind CSS 4.0
- **Icons**: Material Icons
- **Fonts**: Space Grotesk, Inter, JetBrains Mono
- **Utilities**: Custom date utilities for countdowns and timezone conversions (Zurich)

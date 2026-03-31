# launchpadSIX

Mission Control (SpaceX Telemetry System)
Small web Angular application that displays information about SpaceX launchpads and its missions.
The app is designed as a technical dashboard for exploring SpaceX launch facilities. "Telemetry" refers to the automatic recording and transmission of data from remote or inaccessible sources to an IT system in a different location for monitoring and analysis—this app pulls real-time data from the SpaceX API('https://api.spacexdata.com/latest').

## Functionalities

- **Real-time Data**: Fetches the latest launchpad information from the SpaceX API. And latest Artemis II Launching
- **Advanced Grid**: Data displayed by Material-Table.
- **Filtering**: Quick search by name, region, or locality.
- **Pagination**: Configurable records per page .
- **Mission Control UI**: A sleek, dashboard interface.
- **Responsive Design**: Optimized for both desktop & mobile.

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

   The application will be available at `http://localhost:4200`.

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

1. **Run Unit Tests**:
   ```bash
   npm test
   ```

## Technical Stack

- **Framework**: Angular (Zoneless)
- **Grid**: Material table
- **Styling**: Tailwind CSS 4.0
- **Icons**: Material Icons

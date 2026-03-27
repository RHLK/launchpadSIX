# launchpadSIX
Small web   Angular application that displays information about SpaceX launchpads


## Functionalities

- **Real-time Data**: Fetches the latest launchpad information from the SpaceX API.
- **Advanced Grid**: Data displayed by Ag-Grid.
- **Filtering**: Quick search by name, region, or locality.
- **Pagination**: Configurable records per page (default: 5).
- **Mission Control UI**: A sleek, scifi-themed interface inspired by aerospace telemetry systems.
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
   copy environment.example.ts and rename to environment.ts (verify the information: api urls(spaceX,...))
   PRODUCTION set up: an environment.production.ts file must be defined

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:4200`.

4. **Build for Production**:
   ```bash
   npm run build
   ```

## Lint
   ```bash
      npm run lint
   ```

## Testing

1. **Run Unit Tests**:
   ```bash
   npm test
   ```

## Technical Stack

- **Framework**: Angular (Zoneless)
- **Grid**: Ag-Grid Community
- **Styling**: Tailwind CSS 4.0
- **Icons**: Material Icons
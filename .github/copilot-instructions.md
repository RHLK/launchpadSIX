# Copilot Instructions: SpaceX Mission Control

This document provides context and guidelines for the SpaceX Mission Control project tech stack, architecture, and testing strategy.

## Tech Stack

- **Framework:** Angular v21.0.0 (Zoneless, Standalone Components)
- **Styling:** Tailwind CSS v4.1.12 (Utility-first, modern palette)
- **UI Components:** Angular Material v21.0.0
- **Data Grid:** AG Grid v35.2.0 (Quartz Dark theme)
- **Animations:** Motion v12.23.24 (Vanilla JS animations)
- **State Management:** Angular Signals
- **Data Source:** SpaceX API (r-spacex/SpaceX-API)

## Architecture & Best Practices

### Components

- Use **Standalone Components** (default in Angular v21+).
- Set `changeDetection: ChangeDetectionStrategy.OnPush` for all components.
- Use `input()`, `output()`, and `computed()` for state and data flow.
- Prefer **Zoneless** execution; do not use `zone.js` or `provideZoneChangeDetection()`.
- Use native control flow (`@if`, `@for`, `@switch`) instead of legacy directives.

### Styling

- Use Tailwind CSS utility classes for all styling.
- Theme variables are defined in `src/styles.css` under the `@theme` block.
- Component-specific styles should be placed in `src/components.css` using `@apply` where appropriate.
- **Palette:** Dark theme using `mission-bg` (#0a0a0b) and `mission-ink` (#a1a1aa).

### Services

- Use `inject()` for dependency injection instead of constructor injection.
- Services should be provided in `'root'` for singleton behavior.
- Use `signal` and `computed` for reactive state within services.

## Testing Strategy

The project uses **Vitest** for unit and component testing.

### Running Tests

- `npm test`: Runs the test suite using Vitest.
- `npm run lint`: Runs Angular ESLint for code quality checks.

### Guidelines

- Focus on testing business logic in services and component interactions.
- Use `TestBed` for Angular-specific integration tests.
- Mock external dependencies (like the SpaceX service) in component tests.
- Ensure all new features include corresponding `.spec.ts` files.

## Project Structure

- `src/app/components/`: UI components (e.g., `launchpad-explorer.ts`, `mission-control.ts`).
- `src/app/services/`: Core logic and API integration (e.g., `spacex.ts`).
- `src/app/app.routes.ts`: Application routing configuration.
- `src/styles.css`: Global styles and Tailwind theme.
- `src/components.css`: Shared component-level utility classes.
- `metadata.json`: Application metadata and permissions.

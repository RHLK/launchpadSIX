import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Launch } from '../artemis/launch';
import { ArtemisLaunch } from '../../services/artemis/artemis-launch';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, Launch],
  template: `
    <header class="mission-header">
      <div class="mission-header-container">
        <div class="mission-logo-container">
          <div class="mission-logo-icon-wrapper">
            <mat-icon class="mission-logo-icon">rocket_launch</mat-icon>
          </div>
          <div>
            <h1 class="mission-title">Mission Control</h1>
            <span class="mission-subtitle">SpaceX Telemetry System</span>
          </div>
        </div>

        <nav class="mission-nav">
          <a href="#" class="mission-nav-link mission-nav-link-active">Launchpads</a>
          <app-launch />
        </nav>
      </div>
    </header>
  `,
})
export class Header {
  artemisLaunchService = inject(ArtemisLaunch);
}

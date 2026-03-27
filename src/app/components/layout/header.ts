import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [MatIconModule],
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
          <a href="#" class="mission-nav-link">Missions</a>
          <a href="#" class="mission-nav-link">Rockets</a>
        </nav>
      </div>
    </header>
  `
})
export class Header {}

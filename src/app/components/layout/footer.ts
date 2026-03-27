import { Component, inject } from '@angular/core';
import { Launchpads } from '../../services/spacex/launchpads';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="mission-footer">
      <div class="mission-footer-container">
        <div class="mission-stat-grid">
          <div class="mission-stat-item">
            <span class="mission-stat-label">Total Facilities</span>
            <span class="mission-stat-value">{{ launchpadsService.launchpads().length }}</span>
          </div>
          <div class="mission-stat-item">
            <span class="mission-stat-label">Active Status</span>
            <span class="mission-stat-value text-emerald-500">{{ launchpadsService.activeCount() }}</span>
          </div>
          <div class="mission-stat-item">
            <span class="mission-stat-label">Total Launches</span>
            <span class="mission-stat-value">{{ launchpadsService.lLaunches() }}</span>
          </div>
          <div class="mission-stat-item">
            <span class="mission-stat-label">Success Rate</span>
            <span class="mission-stat-value text-blue-400">{{ launchpadsService.successRate() }}%</span>
          </div>
        </div>
        
        <div class="mission-footer-bottom">
          <p class="mission-footer-copy">
            © 2026 SpaceX Mission Control • Launchpads
          </p>
          <div class="mission-footer-links">
            <a href="https://github.com/r-spacex/SpaceX-API/blob/master/docs/README.md" class="mission-footer-link">API Documentation</a>
            <a href="/spaceXStatus" class="mission-footer-link">System Status</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class Footer {
  protected launchpadsService = inject(Launchpads);
}
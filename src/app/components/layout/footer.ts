import { Component, inject } from '@angular/core';
import { Launchpads } from '../../services/spacex/launchpads';
import { ApiStatus } from '../../model/spacex/apiStatus.model';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="mission-footer">
      <div class="mission-footer-container">
        <div class="mission-footer-bottom">
          <p class="mission-footer-copy">© 2026 SpaceX Mission Control </p>
          <div class="mission-footer-links">
            <a
              href="https://github.com/r-spacex/SpaceX-API"
              target="_blank"
              class="mission-footer-link"
              >API Documentation</a
            >
            <a routerLink="/status" class="mission-footer-link flex items-center gap-2">
              <span
                [class]="
                  'h-2 w-2 rounded-full ' +
                  (launchpadsService.apiStatus() === ApiStatus.ONLINE
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                    : launchpadsService.apiStatus() === ApiStatus.OFFLINE
                      ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                      : 'animate-pulse bg-amber-500')
                "
              ></span>
              System Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  protected launchpadsService = inject(Launchpads);
  protected ApiStatus = ApiStatus;
}

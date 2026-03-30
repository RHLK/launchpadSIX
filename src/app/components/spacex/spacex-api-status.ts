import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Launchpads } from '../../services/spacex/launchpads';
import { Launches } from '../../services/spacex/launches';
import { ApiStatus } from '../../model/spacex/apiStatus.model';
import { APP_CONFIG } from '../../config';

@Component({
  selector: 'app-system-status',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  template: `
    <div class="mx-auto flex max-w-4xl flex-col gap-8 p-8">
      <header class="border-mission-line border-b pb-6">
        <h2 class="font-display text-4xl font-bold tracking-tight">System Status</h2>
        <p class="text-mission-ink/60 mt-1">
          Telemetry node health and external API connectivity status.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Launchpads API Health Card -->
        <div class="bg-mission-ink/5 border-mission-line flex flex-col gap-4 rounded-xl border p-6">
          <div class="flex items-center justify-between">
            <h3 class="font-display text-xl font-semibold">Launchpads Endpoint</h3>
            <span
              [class]="
                'rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase ' +
                (launchpadService.apiStatus() === ApiStatus.ONLINE
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : launchpadService.apiStatus() === ApiStatus.OFFLINE
                    ? 'bg-rose-500/10 text-rose-500'
                    : 'bg-amber-500/10 text-amber-500')
              "
            >
              {{ launchesService.apiStatus() }}
            </span>
          </div>
          <p class="text-mission-ink/60 text-sm">
            Connectivity to the SpaceX Launchpads endpoint. Monitors availability of global launch
            facility data.
          </p>
          <div class="text-mission-ink/40 flex items-center gap-2 font-mono text-xs">
            <mat-icon class="h-auto w-auto text-[14px]">cloud_queue</mat-icon>
            ENDPOINT: /launchpads
          </div>
        </div>

        <!-- Launches API Health Card -->
        <div class="bg-mission-ink/5 border-mission-line flex flex-col gap-4 rounded-xl border p-6">
          <div class="flex items-center justify-between">
            <h3 class="font-display text-xl font-semibold">Launches Endpoint</h3>
            <span
              [class]="
                'rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase ' +
                (launchesService.apiStatus() === ApiStatus.ONLINE
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : launchesService.apiStatus() === ApiStatus.OFFLINE
                    ? 'bg-rose-500/10 text-rose-500'
                    : 'bg-amber-500/10 text-amber-500')
              "
            >
              {{ launchesService.apiStatus() }}
            </span>
          </div>
          <p class="text-mission-ink/60 text-sm">
            Connectivity to the SpaceX Launches endpoint. Monitors availability of mission history
            and telemetry.
          </p>
          <div class="text-mission-ink/40 flex items-center gap-2 font-mono text-xs">
            <mat-icon class="h-auto w-auto text-[14px]">cloud_queue</mat-icon>
            ENDPOINT: /launches
          </div>
        </div>

        <!-- Node Health Card -->
        <div class="bg-mission-ink/5 border-mission-line flex flex-col gap-4 rounded-xl border p-6">
          <div class="flex items-center justify-between">
            <h3 class="font-display text-xl font-semibold">{{ config.serviceName }}s</h3>
            <span
              class="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-500 uppercase"
            >
              Operational
            </span>
          </div>
          <p class="text-mission-ink/60 text-sm">
            Internal application state and signal processing. All systems are functioning within
            normal parameters.
          </p>
          <div class="text-mission-ink/40 flex items-center gap-2 font-mono text-xs">
            <mat-icon class="h-auto w-auto text-[14px]">memory</mat-icon>
            {{ config.version }}-STABLE
          </div>
        </div>
      </div>

      <!-- External Links -->
      <section class="mt-4 flex flex-col gap-4">
        <h3 class="font-display text-lg font-semibold">External Resources</h3>
        <div class="flex flex-col gap-2">
          <a
            href="https://twitter.com/spacex"
            target="_blank"
            class="bg-mission-ink/5 hover:bg-mission-ink/10 border-mission-line group flex items-center justify-between rounded-lg border p-4 transition-colors"
          >
            <div class="flex items-center gap-3">
              <mat-icon class="text-mission-accent">campaign</mat-icon>
              <span class="font-medium">Official SpaceX Updates</span>
            </div>
            <mat-icon class="text-mission-ink/20 group-hover:text-mission-ink transition-colors"
              >open_in_new</mat-icon
            >
          </a>
          <a
            href="https://www.spacex.com/launches/"
            target="_blank"
            class="bg-mission-ink/5 hover:bg-mission-ink/10 border-mission-line group flex items-center justify-between rounded-lg border p-4 transition-colors"
          >
            <div class="flex items-center gap-3">
              <mat-icon class="text-mission-accent">rocket</mat-icon>
              <span class="font-medium">Live Mission Dashboard</span>
            </div>
            <mat-icon class="text-mission-ink/20 group-hover:text-mission-ink transition-colors"
              >open_in_new</mat-icon
            >
          </a>
        </div>
      </section>

      <div class="mt-8">
        <button mat-stroked-button color="primary" routerLink="/">
          <mat-icon>arrow_back</mat-icon>
          Return to Mission Control
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background-color: var(--bg);
        color: var(--ink);
      }
    `,
  ],
})
export class SystemStatus implements OnInit {
  protected ApiStatus = ApiStatus;
  protected launchpadService = inject(Launchpads);
  protected launchesService = inject(Launches);
  protected config = APP_CONFIG;

  ngOnInit() {
    // Refresh status on load
    this.launchpadService.getLaunchpads().subscribe();
    this.launchesService.getLaunches().subscribe();
  }
}

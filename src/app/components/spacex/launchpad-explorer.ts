import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule  } from '@angular/common';
import { Launchpad } from '../../model/spacex/launchpad.model';
import { Launchpads } from '../../services/spacex/launchpads';
import { Launches } from '../../services/spacex/launches';
import { CellClickedEvent } from 'ag-grid-community';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { LaunchpadGrid } from "./launchpad/grid/launchpad-grid";
import { LaunchGrid } from "./launchpad/grid/launch-grid";

    
/**
 * SpaceX Launchpad Explorer Component
 * This component provides a real-time dashboard for exploring SpaceX launch facilities.
 * It uses AG Grid for data display, Angular Signals for state management, and 
 * Material Design components for UI elements.
 */
@Component({
  selector: 'app-launchpad-explorer',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FormsModule,
    LaunchpadGrid,
    LaunchGrid
],
  template: `
    <div class="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-8 h-full overflow-auto">
      <!-- Page Header & Controls -->
      <header class="flex flex-col gap-4">
        <p class="text-mission-ink/40">Real-time information on SpaceX launch facilities and its missions.</p>

        <!-- Mission Statistics -->
        <div class="mission-stat-grid !mb-0 !gap-y-4 !gap-x-8">
          <div class="mission-stat-item">
          <span class="mission-stat-label">Total Facilities</span>
          <span class="mission-stat-value !text-lg">{{ launchpadService.launchpads().length }}</span>
        </div>
        <div class="mission-stat-item">
          <span class="mission-stat-label">Active Status</span>
          <span class="mission-stat-value !text-lg text-emerald-500">{{ launchpadService.activeCount() }}</span>
        </div>
        <div class="mission-stat-item">
          <span class="mission-stat-label">Total Launches</span>
          <span class="mission-stat-value !text-lg ">{{ launchpadService.lLaunches() }}</span>
        </div>
        <div class="mission-stat-item">
          <span class="mission-stat-label">Success Rate</span>
          <span class="mission-stat-value !text-lg text-blue-400">{{ launchpadService.successRate() }}%</span>
        </div>
      </div>
    </header>

      <!-- Main Grid Container -->
      <section class="flex flex-col gap-4">
       <div class="relative">
        <app-launchpad-grid
          (cellClicked)="onCellClicked($event)"
        />
      </div>
      </section>

      <!-- Launches Grid Container -->
      @if (selectedLaunchpad()) {
        <section class="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="flex flex-col md:flex-row md:items-center justify-between border-t border-mission-line pt-8 gap-4">
            <div class="flex flex-col gap-1">
              <h3 class="font-display text-xl font-semibold flex items-center gap-2">
                <mat-icon class="text-mission-accent">rocket_launch</mat-icon>
                Launches for {{ selectedLaunchpad()?.name }}
              </h3>
              <p class="text-xs text-mission-ink/40 font-mono uppercase tracking-wider">Historical Mission Data</p>
            </div>

            <div class="flex items-center gap-6 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
              <div class="flex flex-col">
                <span class="text-[10px] uppercase text-mission-ink/40 font-bold tracking-tighter">Total</span>
                <span class="text-sm font-mono font-bold">{{ launchesService.selectedLaunchCount() }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] uppercase text-emerald-500/60 font-bold tracking-tighter">Success</span>
                <span class="text-sm font-mono font-bold text-emerald-500">{{ launchesService.selectedSuccessCount() }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] uppercase text-rose-500/60 font-bold tracking-tighter">Failure</span>
                <span class="text-sm font-mono font-bold text-rose-500">{{ launchesService.selectedFailureCount() }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] uppercase text-blue-400/60 font-bold tracking-tighter">Rate</span>
                <span class="text-sm font-mono font-bold text-blue-400">{{ launchesService.selectedSuccessRate() }}%</span>
              </div>
              <button mat-icon-button (click)="selectedLaunchpad.set(null)" class="text-mission-ink/40 ml-2">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>


          <div class="h-[400px] relative">
          <app-launch-grid/>
      </div>
        </section>
      } 
    </div>
  `,
  styleUrl: './launchpad-explorer.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaunchpadExplorer {

  protected launchpadService = inject(Launchpads);
  protected launchesService = inject(Launches);


  selectedLaunchpad = signal<Launchpad | null>(null);

  constructor() {
    console.log('LaunchpadExplorer: loaded...');
  }

  /**
   * Cell Click Event Handler
   * Specifically handles the "View History" button in the Actions column.
   */
  onCellClicked(event: CellClickedEvent) {
    const target = event.event?.target as HTMLElement;
    if (target && target.classList.contains('view-launches-btn')) {
      const launchpad = event.data as Launchpad;
      this.selectedLaunchpad.set(launchpad);
      
      // Fetch specific launches for this launchpad using the query endpoint
      this.launchesService.queryLaunches({ launchpad: launchpad.id }, { pagination: false }).subscribe();

      // Scroll to launches grid
      setTimeout(() => {
        const el = document.querySelector('section:last-of-type');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

 
}

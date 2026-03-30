import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataGrid, DataGridColDef } from '../../../grid/data-grid';
import { Launches } from '../../../../services/spacex/launches';
import { Launch } from '../../../../model/spacex/launch.model';

/**
 * SpaceX Launchpad Explorer Component
 * This component provides a real-time dashboard for exploring SpaceX launch facilities.
 * It uses AG Grid for data display, Angular Signals for state management, and
 * Material Design components for UI elements.
 */
@Component({
  selector: 'app-launch-grid',
  imports: [CommonModule, MatIconModule, MatButtonModule, DataGrid],
  template: `
    <app-data-grid
      [rowData]="launchesService.launches()"
      [columnDefs]="launchColDefs()"
      [pageSize]="10"
      [loading]="launchesService.loadingLaunches()"
    >
    </app-data-grid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchGrid {
  protected launchesService = inject(Launches);
 /**
   * Material Table Column Definitions for Launches
   */
 launchColDefs = computed<DataGridColDef<Launch>[]>(() => {
  const data = this.launchesService.launches();

  // Extract unique outcomes (success/failure)
  const outcomes = Array.from(new Set(data.map((d) => d.success)))
    .filter((s) => s !== undefined && s !== null)
    .map((s) => ({ label: s ? 'Success' : 'Failure', value: String(s) }));

  return [
    {
      key: 'flight_number',
      header: 'Flight #',
      class: 'font-mono text-xs',
    },
    {
      key: 'name',
      header: 'Mission Name',
      cellRenderer: (data: Launch) => `
        <div class="flex items-center gap-3 py-1">
          ${data.links.patch.small ? `<img src="${data.links.patch.small}" class="w-6 h-6 object-contain" referrerpolicy="no-referrer">` : ''}
          <div class="flex flex-col">
            <span class="font-bold text-mission-ink">${data.name}</span>
            <span class="text-[10px] text-mission-ink/40 font-mono">${new Date(data.date_utc || '').toLocaleDateString()}</span>
          </div>
        </div>
      `,
    },
    {
      key: 'success',
      header: 'Outcome',
      filterOptions: outcomes,
      cellRenderer: (data: Launch) => {
        const color = data.success ? 'text-emerald-500' : 'text-rose-500';
        const label = data.success ? 'Success' : 'Failure';
        return `<span class="${color} uppercase text-[10px] font-bold tracking-widest">${label}</span>`;
      },
    },
    {
      key: 'details',
      header: 'Mission Details',
      cellRenderer: (data: Launch) => `
        <div class="flex items-center h-full py-1">
          <div class="text-xs text-mission-ink/60 italic line-clamp-1 leading-relaxed max-w-[300px]" title="${data.details || ''}">
            ${data.details || 'No mission details available.'}
          </div>
        </div>
      `,
    },
  ];
});
}

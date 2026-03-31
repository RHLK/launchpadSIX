import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataGrid, DataGridColDef } from '../../../grid/data-grid';
import { Launches } from '../../../../services/spacex/launches';
import { Launch } from '../../../../model/spacex/launch.model';
import { formatLocalizedDate, isPast } from '../../../../utils/date-utils';

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
      console.log(data.filter(s => s.status === 'Upcoming'));
    // Extract unique statuses for filter options
    const outcomes = Array.from(new Set(data.map((d) => d.status)))
      .filter((s) => s !== undefined && s !== null)
      .map((s) => ({ label: s, value: s }));

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
        <div class="flex flex-col">
        ${
          data.links.wikipedia
            ? `<a href="${data.links.wikipedia}" target="_blank" rel="noopener noreferrer" class="font-bold text-mission-ink hover:text-mission-accent transition-colors underline decoration-mission-accent/30 underline-offset-4">${data.name}</a>`
            : `<span class="font-bold text-mission-ink">${data.name}</span>`
        }
        ${
          data.status === 'Upcoming' && isPast(data.date_utc)
            ? ''
            : `<span class="text-[10px] text-mission-ink/40 font-mono">${formatLocalizedDate(data.date_utc)}</span>`
        }
        </div>
      `,
      },
      {
        key: 'status',
        header: 'Outcome',
        filterOptions: outcomes,
        cellRenderer: (data: Launch) => {
          let color = 'text-grey-400';
          if (data.status === 'Success') color = 'text-emerald-500';
          if (data.status === 'Failure') color = 'text-rose-500';
          return `<span class="${color} uppercase text-[10px] font-bold tracking-widest">${data.status}</span>`;
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

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataGrid } from '../../../grid/data-grid';
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
      [columnDefs]="launchColDefs"
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
   * AG Grid Column Definitions for Launches
   */
  launchColDefs: ColDef[] = [
    {
      field: 'flight_number',
      headerName: 'Flight #',
      width: 100,
      cellClass: 'font-mono text-xs',
    },
    {
      field: 'name',
      headerName: 'Mission Name',
      flex: 1,
      cellRenderer: (params: ICellRendererParams<Launch>) => `
        <div class="flex items-center gap-3 py-2">
          ${params.data?.links.patch.small ? `<img src="${params.data.links.patch.small}" class="w-8 h-8 object-contain" referrerpolicy="no-referrer">` : ''}
          <div class="flex flex-col">
            <span class="font-bold text-mission-ink">${params.value}</span>
            <span class="text-[10px] text-mission-ink/60 font-mono">${new Date(params.data?.date_utc || '').toLocaleDateString()}</span>
          </div>
        </div>
      `,
      autoHeight: true,
    },
    {
      field: 'success',
      headerName: 'Outcome',
      width: 120,
      cellRenderer: (params: ICellRendererParams<Launch>) => {
        if (params.value === null)
          return '<span class="text-mission-ink/40 uppercase text-[10px] font-bold">Upcoming</span>';
        const color = params.value ? 'text-emerald-500' : 'text-rose-500';
        const label = params.value ? 'Success' : 'Failure';
        return `<span class="${color} uppercase text-[10px] font-bold tracking-widest">${label}</span>`;
      },
    },
    {
      field: 'details',
      headerName: 'Mission Details',
      flex: 2,
      cellClass: 'text-xs text-mission-ink/60 italic line-clamp-2 leading-relaxed',
      tooltipField: 'details',
    },
    {
      headerName: 'Actions',
      width: 150,
      cellRenderer: (params: ICellRendererParams<Launch>) => {
        return `
          <div class="flex gap-2 items-center h-full">
            <a href="${params.data?.links.wikipedia}" target="_blank" class="text-mission-ink/40 hover:text-mission-ink transition-colors">
              <span class="material-icons text-[18px]">info</span>
            </a>
          </div>
        `;
      },
    },
  ];
}

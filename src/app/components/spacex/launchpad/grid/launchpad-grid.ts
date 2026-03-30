import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Launchpad } from '../../../../model/spacex/launchpad.model';
import { Launchpads } from '../../../../services/spacex/launchpads';
import { DataGrid, DataGridColDef } from '../../../grid/data-grid';
import { MatIconModule } from '@angular/material/icon';

/**
 * SpaceX Launchpad Explorer Component
 * This component provides a real-time dashboard for exploring SpaceX launch facilities.
 * It uses AG Grid for data display, Angular Signals for state management, and
 * Material Design components for UI elements.
 */
@Component({
  selector: 'app-launchpad-grid',
  imports: [CommonModule, DataGrid, MatIconModule],
  template: `
    <!-- Templates -->
    <ng-template #launchesTemplate let-data>
      @if (data.launches?.length > 0) {
        <div
          class="view-launches-btn text-mission-accent hover:text-mission-accent/80 flex cursor-pointer items-center gap-1 transition-colors"
          title="Select a facility to view its mission history"
        >
          <mat-icon class="pointer-events-none !text-[16px]">rocket_launch</mat-icon>
          <span class="pointer-events-none font-mono text-xs">{{ data.launches.length }}</span>
        </div>
      } @else {
        <span class="text-mission-ink/20 font-mono text-xs">0</span>
      }
    </ng-template>

    <app-data-grid
      [columnDefs]="colDefs()"
      [pageSize]="pageSize()"
      [loading]="launchpadService.loading()"
      [rowData]="rowData"
      (cellClicked)="onCellClicked($event)"
    >
    </app-data-grid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchpadGrid {
  protected launchpadService = inject(Launchpads);

  // Row Data: The data to be displayed.
  rowData: Launchpad[] = [];

  pageSize = signal(5);

  selectedLaunchpad = signal<Launchpad | null>(null);
  launchesTemplate = viewChild<TemplateRef<any>>('launchesTemplate');

  /**
   * Material Table Column Definitions for Launchpads
   */
  colDefs = computed<DataGridColDef<Launchpad>[]>(() => {

    const data = this.launchpadService.launchpads();
    const template = this.launchesTemplate();
    
    if (!template) return [];

    // Extract unique regions from data
    const regions = Array.from(new Set(data.map((d) => d.region).filter(Boolean)))
      .sort()
      .map((r) => ({
        label: r
          .split(/[\s_-]+/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' '),
        value: r.toLowerCase(),
      }));

    // Extract unique statuses from data
    const statuses = Array.from(new Set(data.map((d) => d.status).filter(Boolean)))
      .sort()
      .map((s) => ({
        label: s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(),
        value: s.toLowerCase(),
      }));

    return [
      {
        key: 'name',
        header: 'Facility Name',
        cellRenderer: (data: Launchpad) => `
          <div class="flex flex-col py-1">
            <span class="font-bold text-mission-ink">${data.name}</span>
            <span class="text-[10px] text-mission-ink/40 font-mono">${data.locality}</span>
          </div>
        `,
      },
      {
        key: 'region',
        header: 'Region',
        class: 'font-mono text-xs',
        filterOptions: regions,
      },
      {
        key: 'status',
        header: 'Status',
        filterOptions: statuses,
        cellRenderer: (data: Launchpad) => {
          const color = data.status === 'active' ? 'text-emerald-500' : 'text-amber-500';
          return `<span class="${color} uppercase text-[10px] font-bold tracking-widest">${data.status}</span>`;
        },
      },
      {
        key: 'launches',
        header: 'Missions',
        filterable: false,
        cellTemplate: template,
      },
    ];
  });

  constructor() {
    this.launchpadService.getLaunchpads().subscribe((data) => {
      this.rowData = data;
    });
  }

  cellClicked = output<any>();

  onCellClicked(params: any) {
    this.cellClicked.emit(params);
  }
}

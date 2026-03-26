import { ChangeDetectionStrategy, Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule  } from '@angular/common';
import { Launchpad } from '../model/launchpad.model';
import { Launchpads } from '../services/launchpads';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi, ICellRendererParams } from 'ag-grid-community';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

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
    AgGridAngular,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  template: `
    <div class="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <!-- Page Header & Controls -->
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-mission-line pb-6">
        <div>
          <h2 class="font-display text-4xl font-bold tracking-tight">Launchpad Explorer</h2>
          <p class="text-mission-ink/60 mt-1">Real-time telemetry and configuration for global SpaceX launch facilities.</p>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <mat-form-field appearance="outline" class="mission-field">
            <mat-label>Search Facilities</mat-label>
            <input matInput (input)="onFilterChange($event)" placeholder="Name or Region...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="mission-field w-32">
            <mat-label>Page Size</mat-label>
            <mat-select [ngModel]="pageSize()" (ngModelChange)="pageSize.set($event); onPageSizeChange()">
              <mat-option [value]="5">5</mat-option>
              <mat-option [value]="10">10</mat-option>
              <mat-option [value]="20">20</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </header>

      <!-- Main Grid -->
      <div class="flex-1 min-h-[500px] relative">
        <div class="absolute top-0 right-0 p-2 text-xs font-mono text-mission-ink/20 z-20">
          TELEMETRY STATUS: {{ launchpadService.launchpads().length }} NODES
        </div>
        @if (launchpadService.loading()) {
          <div class="absolute inset-0 z-10 flex items-center justify-center bg-mission-bg/50 backdrop-blur-sm">
            <mat-progress-spinner mode="indeterminate" diameter="48"></mat-progress-spinner>
          </div>
        }

          <!--ag-grid-angular
            class="ag-theme-quartz-dark w-full h-full rounded-xl overflow-hidden border border-mission-line"
            [rowData]="launchpadService.launchpads()"
            [columnDefs]="colDefs"
            [pagination]="true"
            [paginationPageSize]="pageSize()"
            [paginationPageSizeSelector]="false"
            (gridReady)="onGridReady($event)"
          >
          </ag-grid-angular-->
        
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .mission-field {
      margin-bottom: -1.25em;
    }

    ::ng-deep .mission-field .mat-mdc-form-field-flex {
      background-color: rgba(255, 255, 255, 0.03) !important;
    }

    ::ng-deep .mission-field .mat-mdc-form-field-outline {
      color: rgba(255, 255, 255, 0.1) !important;
    }

    ::ng-deep .ag-theme-quartz-dark {
      --ag-font-family: 'Inter', sans-serif;
      --ag-header-foreground-color: rgba(255, 255, 255, 0.5);
      --ag-header-column-separator-display: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaunchpadExplorer {
  protected launchpadService = inject(Launchpads);
  private gridApi!: GridApi;

  pageSize = signal(5);

  /**
   * AG Grid Column Definitions
   * Defines the structure, styling, and custom rendering for the grid columns.
   */
  colDefs: ColDef[] = [
    {
      field: 'name',
      headerName: 'Facility Name',
      flex: 1,
      cellRenderer: (params: ICellRendererParams<Launchpad>) => `
        <div class="flex flex-col py-2">
          <span class="font-bold text-mission-ink">${params.value}</span>
          <span class="text-xs text-mission-ink/40 font-mono">${params.data?.locality}</span>
        </div>
      `,
      autoHeight: true
    },
    {
      field: 'region',
      headerName: 'Region',
      width: 150,
      cellClass: 'font-mono text-xs'
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      cellRenderer: (params: ICellRendererParams<Launchpad>) => {
        const color = params.value === 'active' ? 'text-emerald-500' : 'text-amber-500';
        return `<span class="${color} uppercase text-[10px] font-bold tracking-widest">${params.value}</span>`;
      }
    },
    {
      headerName: 'Launches',
      valueGetter: (params) => params.data?.launches?.length || 0,
      width: 120,
      cellClass: 'font-mono text-center'
    },
    {
      headerName: 'Actions',
      width: 150,
      cellRenderer: (params: ICellRendererParams<Launchpad>) => {
        return `
          <div class="flex gap-2 items-center h-full">
            <a href="${params.data?.wikipedia}" target="_blank" class="text-mission-accent hover:underline text-xs flex items-center gap-1">
              Wiki <span class="material-icons text-[14px]">open_in_new</span>
            </a>
          </div>
        `;
      }
    }
  ];

  constructor() {
    console.log('LaunchpadExplorer: Fetching launchpads...');
    this.launchpadService.getLaunchpads().subscribe({
      next: (data: Launchpad[]) => {
        //console.log('LaunchpadExplorer: Received data:', data);
        if (this.gridApi) {
          console.log('LaunchpadExplorer: Setting rowData manually on data arrival');
          this.gridApi.setGridOption('rowData', [...data]);
        }
      },
      error: (err: any) => {
        console.error('LaunchpadExplorer: Error fetching data:', err);
      }
    });
  }

  /**
   * Grid Ready Event Handler
   * Captures the Grid API and ensures data is bound if it arrived before the grid was ready.
   */
  onGridReady(params: GridReadyEvent) {
    console.log('LaunchpadExplorer: Grid Ready');
    this.gridApi = params.api;
    // Force a refresh if data is already loaded
    if (this.launchpadService.launchpads().length > 0) {
      console.log('LaunchpadExplorer: Setting rowData manually on ready');
      this.gridApi.setGridOption('rowData', [...this.launchpadService.launchpads()]);
    }
  }

  onFilterChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.gridApi.setGridOption('quickFilterText', val);
  }

  onPageSizeChange() {
    if (this.gridApi) {
      this.gridApi.setGridOption('paginationPageSize', this.pageSize());
    }
  }
}

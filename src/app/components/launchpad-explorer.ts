import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule  } from '@angular/common';
import { Launchpad } from '../model/launchpad.model';
import { Launchpads } from '../services/launchpads';
import { ColDef, GridApi, ICellRendererParams } from 'ag-grid-community';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { DataGrid } from "./grid/data-grid";

    
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
    DataGrid
],
  template: `
    <div class="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      

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

        <app-data-grid
          [columnDefs]="colDefs"
          [pageSize]="pageSize()"
          [loading]="launchpadService.loading()"
          (gridReady)="onGridReady()"
          [rowData]="rowData"
        >
        </app-data-grid>
        
      </div>
    </div>
  `,
  styleUrl: './launchpad-explorer.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaunchpadExplorer {
  protected launchpadService = inject(Launchpads);

  private gridApi!: GridApi;
    // Row Data: The data to be displayed.
    rowData: Launchpad[] = [];

  pageSize = signal(5);

  /**
   * AG Grid Column Definitions
   * Defines the structure, styling, and custom rendering for the grid columns.
   */
  colDefs: ColDef[] = [
    {
      field: 'name',
      headerName: 'Facility Name',
      filter: 'agSetColumnFilter',
      flex: 1,
      cellRenderer: (params: ICellRendererParams<Launchpad>) => `
        <div class="flex flex-col py-2">
          <span class="font-bold text-mission-ink/140">${params.value}</span>
          <span class="text-xs text-mission-ink/80 font-mono">${params.data?.locality}</span>
        </div>
      `,
      autoHeight: true
    },
    {
      field: 'region',
      headerName: 'Region',
      width: 150,
      cellClass: 'font-mono text-xs', 
      filter: 'agSetColumnFilter'
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
    console.log('LaunchpadExplorer: loaded...');
   
  }

  /**
   * Grid Ready Event Handler
   * Captures the Grid API and ensures data is bound if it arrived before the grid was ready.
   */
  onGridReady() {
    console.log('LaunchpadExplorer: Grid Ready');
    // Force a refresh if data is already loaded
    this.launchpadService.getLaunchpads().subscribe((data) => {this.rowData = data; console.log(data);});
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

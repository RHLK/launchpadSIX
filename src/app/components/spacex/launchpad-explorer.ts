import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule  } from '@angular/common';
import { Launchpad } from '../../model/spacex/launchpad.model';
import { Launchpads } from '../../services/spacex/launchpads';
import { Launches } from '../../services/spacex/launches';
import { CellClickedEvent, ColDef, GridApi, ICellRendererParams } from 'ag-grid-community';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { DataGrid } from "../grid/data-grid";
import { Launch } from '../../model/spacex/launch.model';
import { LaunchpadGrid } from "./launchpad/grid/launchpad-grid";

    
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
    DataGrid,
    LaunchpadGrid
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
        <app-launchpad-grid
          (cellClicked)="onCellClicked($event)"
        />
        
      </div>

      <!-- Launches Grid Container -->
      @if (selectedLaunchpad()) {
        <section class="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="flex items-center justify-between border-t border-mission-line pt-8">
            <h3 class="font-display text-xl font-semibold flex items-center gap-2">
              <mat-icon class="text-mission-accent">rocket_launch</mat-icon>
              Launches for {{ selectedLaunchpad()?.name }}
            </h3>
            <button mat-icon-button (click)="selectedLaunchpad.set(null)" class="text-mission-ink/40">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="h-[400px] relative">
            <app-data-grid
              [rowData]="launchesService.launches()"
              [columnDefs]="launchColDefs"
              [pageSize]="10"
              [loading]="launchesService.loadingLaunches()"
            >
            </app-data-grid>
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

  private gridApi!: GridApi;
    
  // Row Data: The data to be displayed.
  rowData: Launchpad[] = [];

  pageSize = signal(5);

  selectedLaunchpad = signal<Launchpad | null>(null);


  /**
   * AG Grid Column Definitions for Launches
   */
  launchColDefs: ColDef[] = [
    {
      field: 'flight_number',
      headerName: 'Flight #',
      width: 100,
      cellClass: 'font-mono text-xs'
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
            <span class="text-[10px] text-mission-ink/40 font-mono">${new Date(params.data?.date_utc || '').toLocaleDateString()}</span>
          </div>
        </div>
      `,
      autoHeight: true
    },
    {
      field: 'success',
      headerName: 'Outcome',
      width: 120,
      cellRenderer: (params: ICellRendererParams<Launch>) => {
        if (params.value === null) return '<span class="text-mission-ink/40 uppercase text-[10px] font-bold">Upcoming</span>';
        const color = params.value ? 'text-emerald-500' : 'text-rose-500';
        const label = params.value ? 'Success' : 'Failure';
        return `<span class="${color} uppercase text-[10px] font-bold tracking-widest">${label}</span>`;
      }
    },
    {
      field: 'details',
      headerName: 'Mission Details',
      flex: 2,
      cellClass: 'text-xs text-mission-ink/60 italic line-clamp-2 leading-relaxed',
      tooltipField: 'details'
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
      }
    }
  ];

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

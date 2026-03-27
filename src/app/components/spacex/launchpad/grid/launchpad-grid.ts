import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { CommonModule  } from '@angular/common';
import { Launchpad } from '../../../../model/spacex/launchpad.model';
import { Launchpads } from '../../../../services/spacex/launchpads';
import { CellClickedEvent, ColDef, ICellRendererParams } from 'ag-grid-community';
import { DataGrid } from "../../../grid/data-grid";

    
/**
 * SpaceX Launchpad Explorer Component
 * This component provides a real-time dashboard for exploring SpaceX launch facilities.
 * It uses AG Grid for data display, Angular Signals for state management, and 
 * Material Design components for UI elements.
 */
@Component({
  selector: 'app-launchpad-grid',
  imports: [
    CommonModule,
    DataGrid
],
  template: `
          <app-data-grid
          [columnDefs]="colDefs"
          [pageSize]="pageSize()"
          [loading]="launchpadService.loading()"
          (gridReady)="onGridReady()"
          [rowData]="rowData"
          (cellClicked)="onCellClicked($event)"
        >
        </app-data-grid>
        
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaunchpadGrid {

  protected launchpadService = inject(Launchpads);
    
  // Row Data: The data to be displayed.
  rowData: Launchpad[] = [];

  pageSize = signal(5);

  selectedLaunchpad = signal<Launchpad | null>(null);
  
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
          <span class="font-bold text-mission-ink/70">${params.value}</span>
          <span class="text-xs text-mission-ink/60 font-mono">${params.data?.locality}</span>
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
        field: 'locality',
        headerName: 'Locality',
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
      cellRenderer: (params: ICellRendererParams<Launchpad>) => {
        const count = params.data?.launches?.length || 0;
        if (count === 0) return '<span class="text-mission-ink/20 font-mono text-xs">0</span>';
        return `
        <button 
            class="view-launches-btn flex items-center justify-center gap-1 w-full h-full text-mission-accent hover:text-mission-accent/80 transition-colors cursor-pointer"
            title="Select a facility to view its launches history">
            <span class="material-icons text-[18px] pointer-events-none">rocket_launch</span>
            <span class="font-mono text-xs pointer-events-none">${count}</span>
        </button>
        `;
      }
    }
  ];

  cellClicked = output<CellClickedEvent>();

  onCellClicked(params: CellClickedEvent) {
    this.cellClicked.emit(params);
  }

  /**
   * Grid Ready Event Handler
   * Captures the Grid API and ensures data is bound if it arrived before the grid was ready.
   */
  onGridReady() {
    console.log('Launchpad Grid Ready');
    // Force a refresh if data is already loaded
    this.launchpadService.getLaunchpads().subscribe((data) => {this.rowData = data; console.log(data);});
  }

}

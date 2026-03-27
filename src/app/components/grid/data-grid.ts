import { ChangeDetectionStrategy, Component, input, output, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, CellClickedEvent, ColDef, GridApi, GridReadyEvent, ModuleRegistry } from 'ag-grid-community';
import { SetFilterModule } from 'ag-grid-enterprise';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



ModuleRegistry.registerModules([ AllCommunityModule, SetFilterModule]);
/**
 * Shared Data Grid Component
 * A reusable wrapper for AG Grid with built-in loading states and consistent styling.
 */
@Component({
  selector: 'app-data-grid',
  imports: [CommonModule, AgGridAngular, MatProgressSpinnerModule],
  template: `
    <div class="flex-1 min-h-[500px] relative h-full">
      <!-- Loading Overlay -->
      @if (loading()) {
        <div class="absolute inset-0 z-10 flex items-center justify-center bg-mission-bg/50 backdrop-blur-sm rounded-xl">
          <mat-progress-spinner mode="indeterminate" diameter="48"></mat-progress-spinner>
        </div>
      }

      <!-- Grid Instance -->
      @if (isBrowser) {
        <ag-grid-angular

        style="width: 100%; height: 550px;"
          [class]="theme() + ' w-full h-full rounded-xl overflow-hidden border border-mission-line'"
          [rowData]="rowData()"
          [columnDefs]="columnDefs()"
          [pagination]="true"
          [paginationPageSize]="pageSize()"
          [paginationPageSizeSelector]="paginationPageSizeSelector()"
          (gridReady)="onGridReady($event)"
          (cellClicked)="onCellClicked($event)"

        >
        </ag-grid-angular>
      } @else {
        <!-- SSR Fallback -->
        <div class="w-full h-full rounded-xl border border-mission-line bg-mission-line/5 flex items-center justify-center">
          <span class="text-mission-ink/20 font-mono text-sm uppercase tracking-widest">Initializing Telemetry...</span>
        </div>
      }
    </div>
  `,
  styleUrl: './data-grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DataGrid<T = unknown> {
  
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  private gridApi!: GridApi;
  // Inputs using the new signal-based input() API
  rowData = input<T[]>([]);
  columnDefs = input<ColDef[]>([]);
  pageSize = input<number>(10);
  loading = input<boolean>(false);
  theme = input<string>('ag-theme-quartz-dark');
  // allows the user to select the page size from a predefined list of page sizes
  paginationPageSizeSelector = input<number[]>([5, 10, 20, 50, 100]);

  // Outputs using the new signal-based output() API
  gridReady = output<GridReadyEvent>();
  cellClicked = output<CellClickedEvent>();

  onGridReady(params: GridReadyEvent) {
    this.gridReady.emit(params);
  }

  onCellClicked(params: CellClickedEvent) {
    this.cellClicked.emit(params);
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

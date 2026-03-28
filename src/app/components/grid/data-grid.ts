import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellClickedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  Theme,
  themeQuartz,
} from 'ag-grid-community';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Shared Data Grid Component
 * A reusable wrapper for AG Grid with built-in loading states and consistent styling.
 */
@Component({
  selector: 'app-data-grid',
  imports: [CommonModule, AgGridAngular, MatProgressSpinnerModule],
  template: `
    <div class="relative h-full min-h-[550px] flex-1">
      <!-- Loading Overlay -->
      @if (loading()) {
        <div
          class="bg-mission-bg/50 absolute inset-0 z-10 flex items-center justify-center rounded-xl backdrop-blur-sm"
        >
          <mat-progress-spinner mode="indeterminate" diameter="48"></mat-progress-spinner>
        </div>
      }

      <!-- Grid Instance -->
      @if (isBrowser) {
        <ag-grid-angular
          style="width: 100%; height: 550px;"
          class="border-mission-line h-full w-full overflow-hidden rounded-xl border"
          [theme]="gridTheme()"
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
        <div
          class="border-mission-line bg-mission-line/5 flex h-full w-full items-center justify-center rounded-xl border"
        >
          <span class="text-mission-ink/20 font-mono text-sm tracking-widest uppercase"
            >Initializing Telemetry...</span
          >
        </div>
      }
    </div>
  `,
  styleUrl: './data-grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  // Use the new Theming API with CSS variables from styles.css
  gridTheme = input<Theme>(
    themeQuartz.withParams({
      backgroundColor: 'var(--color-mission-bg)',
      headerBackgroundColor: 'var(--color-mission-header-bg)',
      oddRowBackgroundColor: 'var(--color-mission-odd-row-bg)',
      borderColor: 'var(--color-mission-line)',
      rowHoverColor: 'var(--color-mission-accent-muted)',
      selectedRowBackgroundColor: 'var(--color-mission-accent-selected)',
      fontFamily: 'var(--font-sans)',
      headerTextColor: 'var(--color-mission-ink)',
      textColor: 'var(--color-mission-ink)',
    }),
  );

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

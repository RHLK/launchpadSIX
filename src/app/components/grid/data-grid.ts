import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
  effect,
  computed,
  TemplateRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Column definition for the DataGrid component.
 */
export interface DataGridColDef<T> {
  key: string;
  header: string;
  cellRenderer?: (data: T) => string;
  cellTemplate?: TemplateRef<any>;
  width?: string;
  class?: string;
  filterable?: boolean;
  filterOptions?: { label: string; value: string }[];
}
/**
 * Shared Data Grid Component
 * A reusable wrapper for AG Grid with built-in loading states and consistent styling.
 */
@Component({
  selector: 'app-data-grid',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
  ],
  template: `
    <div class="relative flex h-full min-h-[400px] flex-1 flex-col gap-4">
      <!-- Loading Overlay -->
      @if (loading()) {
        <div
          class="bg-mission-bg/50 absolute inset-0 z-10 flex items-center justify-center rounded-xl backdrop-blur-sm"
        >
          <mat-progress-spinner mode="indeterminate" diameter="48" />
        </div>
      }

      <!-- Table Container -->
      <div
        class="border-mission-line flex-1 overflow-auto rounded-t-xl border border-b-0 bg-white/5"
      >
        <table mat-table [dataSource]="dataSource" matSort class="w-full bg-transparent!">
          @for (col of columnDefs(); track col.key) {
            <ng-container [matColumnDef]="col.key">
              <th
                mat-header-cell
                *matHeaderCellDef
                mat-sort-header
                class="bg-mission-header-bg! border-mission-line! text-mission-ink font-display! text-xs! font-bold! tracking-widest uppercase!"
                [style.width]="col.width"
              >
                {{ col.header }}
              </th>
              <td
                mat-cell
                *matCellDef="let element"
                class="border-mission-line! text-mission-ink/80 font-sans! text-sm!"
                [ngClass]="col.class"
                (click)="onRowClick(element, col.key, $event)"
              >
                @if (col.cellTemplate) {
                  <ng-container
                    [ngTemplateOutlet]="col.cellTemplate"
                    [ngTemplateOutletContext]="{ $implicit: element }"
                  />
                } @else if (col.cellRenderer) {
                  <div [innerHTML]="getSafeHtml(col, element)"></div>
                } @else {
                  {{ element[col.key] }}
                }
              </td>
            </ng-container>

            <!-- Filter Column Definition -->
            <ng-container [matColumnDef]="col.key + '-filter'">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="bg-mission-header-bg! border-mission-line! p-2!"
              >
                @if (showFilter() && col.filterable !== false) {
                  <mat-form-field
                    class="mission-field w-full"
                    appearance="outline"
                    subscriptSizing="dynamic"
                  >
                    @if (col.filterOptions) {
                      <mat-select
                        (selectionChange)="applyColumnFilter(col.key, $event.value)"
                        placeholder="All"
                        class="font-mono text-[10px]"
                      >
                        <mat-option [value]="">All</mat-option>
                        @for (opt of col.filterOptions; track opt.value) {
                          <mat-option [value]="opt.value">{{ opt.label }}</mat-option>
                        }
                      </mat-select>
                    } @else {
                      <input
                        matInput
                        (keyup)="applyColumnFilter(col.key, $any($event.target).value)"
                        placeholder="Filter..."
                        class="font-mono text-[10px]"
                      />
                    }
                  </mat-form-field>
                }
              </th>
            </ng-container>
          }

          <tr mat-header-row *matHeaderRowDef="displayedColumns(); sticky: true"></tr>
          <tr
            mat-header-row
            *matHeaderRowDef="filterColumns(); sticky: true"
            class="filter-row"
          ></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns()"
            class="hover:bg-mission-accent-muted/20 transition-colors"
          ></tr>

          <!-- No Data Row -->
          <tr class="mat-row" *matNoDataRow>
            <td
              class="mat-cell border-mission-line! p-8 text-center"
              [attr.colspan]="displayedColumns().length"
            >
              @if (!loading()) {
                <span class="text-mission-ink/20 font-mono text-sm tracking-widest uppercase"
                  >No mission data available</span
                >
              }
            </td>
          </tr>
        </table>
      </div>

      <!-- Paginator -->
      <mat-paginator
        [pageSize]="pageSize()"
        [pageSizeOptions]="[5, 10, 25, 50]"
        class="bg-mission-header-bg! border-mission-line! text-mission-ink! rounded-b-xl border"
        aria-label="Select page of missions"
      />
    </div>
  `,
  styleUrl: './data-grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGrid<T = unknown> {
  private sanitizer = inject(DomSanitizer);

  // Inputs using the new signal-based input() API
  rowData = input<T[]>([]);
  columnDefs = input<DataGridColDef<T>[]>([]);
  pageSize = input<number>(10);
  loading = input<boolean>(false);
  showFilter = input<boolean>(true);

  // Outputs
  cellClicked = output<{ data: T; key: string; event: MouseEvent }>();

  // View Children
  paginator = viewChild(MatPaginator);
  sort = viewChild(MatSort);

  // Data Source
  dataSource = new MatTableDataSource<T>([]);
  private columnFilterMap = new Map<string, string>();

  // Computed columns
  displayedColumns = computed(() => this.columnDefs().map((c) => c.key));
  filterColumns = computed(() => this.columnDefs().map((c) => c.key + '-filter'));

  constructor() {
    // Configure filter predicate with access to column definitions for smart matching
    this.dataSource.filterPredicate = (data: T, _filter: string) => {
      const colDefs = this.columnDefs();

      // Check every active filter in our map
      for (const [key, searchTerm] of this.columnFilterMap.entries()) {
        if (!searchTerm) continue;

        const value = (data as any)[key];
        const dataValue = String(value ?? '').toLowerCase();

        // Find the column definition to determine matching strategy
        const colDef = colDefs.find((c) => c.key === key);

        // Use exact match for columns with predefined options (e.g., status, success)
        if (colDef?.filterOptions) {
          if (dataValue !== searchTerm) return false;
        } else {
          // Use partial match for text inputs
          if (!dataValue.includes(searchTerm)) return false;
        }
      }
      return true;
    };

    // Sync rowData with dataSource
    effect(() => {
      const data = this.rowData();
      this.dataSource.data = data;
      // Re-trigger filter when data changes by re-assigning the filter string
      const currentFilter = this.dataSource.filter;
      this.dataSource.filter = '';
      this.dataSource.filter = currentFilter || ' ';
    });

    // Sync paginator and sort
    effect(() => {
      const p = this.paginator();
      const s = this.sort();
      if (p) this.dataSource.paginator = p;
      if (s) this.dataSource.sort = s;
    });
  }

  applyColumnFilter(column: string, value: any) {
    const filterValue = String(value ?? '')
      .trim()
      .toLowerCase();
    this.columnFilterMap.set(column, filterValue);

    // Setting a new filter string triggers the filterPredicate
    // We use a timestamp to ensure the value is always different, forcing a re-filter
    this.dataSource.filter = `filter-${Date.now()}`;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRowClick(data: T, key: string, event: MouseEvent) {
    this.cellClicked.emit({ data, key, event });
  }

  getSafeHtml(col: DataGridColDef<T>, element: T): SafeHtml {
    const html = col.cellRenderer ? col.cellRenderer(element) : '';
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

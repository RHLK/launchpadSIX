import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataGrid, DataGridColDef } from './data-grid';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, signal } from '@angular/core';

interface TestData {
  id: string;
  name: string;
  status: string;
}

@Component({
  standalone: true,
  imports: [DataGrid],
  template: `
    <app-data-grid
      [rowData]="data()"
      [columnDefs]="columns()"
      [pageSize]="pageSize()"
      [loading]="loading()"
      (cellClicked)="onCellClicked($event)"
    />
  `,
})
class TestHostComponent {
  data = signal<TestData[]>([
    { id: '1', name: 'Item 1', status: 'active' },
    { id: '2', name: 'Item 2', status: 'inactive' },
    { id: '3', name: 'Item 3', status: 'active' },
  ]);

  columns = signal<DataGridColDef<TestData>[]>([
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'status',
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
  ]);

  pageSize = signal(5);
  loading = signal(false);
  clickedCell: any = null;

  onCellClicked(event: any) {
    this.clickedCell = event;
  }
}

describe('DataGrid Component', () => {
  let component: DataGrid<TestData>;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGrid, TestHostComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct number of rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('tr.mat-mdc-row');
    expect(rows.length).toBe(3);
  });

  it('should render headers correctly', () => {
    const headers = fixture.nativeElement.querySelectorAll('th.mat-mdc-header-cell');
    // 3 data headers + 3 filter headers = 6
    expect(headers.length).toBe(6);
    expect(headers[0].textContent.trim()).toBe('ID');
    expect(headers[1].textContent.trim()).toBe('Name');
    expect(headers[2].textContent.trim()).toBe('Status');
  });

  it('should filter data correctly with text input', async () => {
    // Apply filter to 'name' column
    component.applyColumnFilter('name', 'Item 1');
    fixture.detectChanges();
    await fixture.whenStable();

    const rows = fixture.nativeElement.querySelectorAll('tr.mat-mdc-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Item 1');
  });

  it('should filter data correctly with select options', async () => {
    // Apply filter to 'status' column
    component.applyColumnFilter('status', 'inactive');
    fixture.detectChanges();
    await fixture.whenStable();

    const rows = fixture.nativeElement.querySelectorAll('tr.mat-mdc-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('inactive');
  });

  it('should show loading spinner when loading is true', () => {
    hostComponent.loading.set(true);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('mat-progress-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should emit cellClicked event on row click', () => {
    const firstCell = fixture.nativeElement.querySelector('td.mat-mdc-cell');
    firstCell.click();
    expect(hostComponent.clickedCell).toBeTruthy();
    expect(hostComponent.clickedCell.data.id).toBe('1');
    expect(hostComponent.clickedCell.key).toBe('id');
  });

  it('should show "No mission data available" when data is empty', () => {
    hostComponent.data.set([]);
    fixture.detectChanges();
    const noDataMessage = fixture.nativeElement.querySelector('.mat-row');
    expect(noDataMessage.textContent).toContain('No mission data available');
  });

  it('should render custom HTML via cellRenderer', () => {
    hostComponent.columns.set([
      {
        key: 'name',
        header: 'Name',
        cellRenderer: (data) => `<span class="custom-cell">${data.name}</span>`,
      },
    ]);
    fixture.detectChanges();
    const customCell = fixture.nativeElement.querySelector('.custom-cell');
    expect(customCell).toBeTruthy();
    expect(customCell.textContent).toBe('Item 1');
  });
});

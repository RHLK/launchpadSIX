import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LaunchpadExplorer } from './launchpad-explorer';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { signal, computed } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Launchpad } from '../../model/spacex/launchpad.model';
import { Launch } from '../../model/spacex/launch.model';
import { ApiStatus } from '../../model/spacex/apiStatus.model';
import { SpaceXClient } from '../../services/spacex/spacex-client';
import { Launchpads } from '../../services/spacex/launchpads';

describe('LaunchpadExplorer Component', () => {
  
  let component: LaunchpadExplorer;
  let fixture: ComponentFixture<LaunchpadExplorer>;
  

  const mockLaunchpads: Launchpad[] = [
    {
      id: '1',
      name: 'VAFB SLC 4E',
      full_name: 'Vandenberg Air Force Base Space Launch Complex 4E',
      region: 'California',
      locality: 'Vandenberg Air Force Base',
      latitude: 34.632093,
      longitude: -120.610829,
      launch_attempts: 15,
      launch_successes: 15,
      status: 'active',
      wikipedia: 'https://en.wikipedia.org/wiki/Vandenberg_AFB_Space_Launch_Complex_4',
      details: "SpaceX's primary West Coast launch facility...",
      launches: ['1', '2'],
    },
  ];

  beforeEach(async () => {
    const launchpadsSignal = signal(mockLaunchpads);
    const launchesSignal = signal<Launch[]>([]);
    const launchpadServiceMock = {
      launchpads: launchpadsSignal,
      loading: signal(false),
      loadingLaunches: signal(false),
      loadingUpcoming: signal(false),
      apiStatus: signal(ApiStatus.ONLINE),
      activeCount: computed(() => launchpadsSignal().filter((l) => l.status === 'active').length),
      lLaunches: computed(() =>
        launchpadsSignal().reduce((acc, l) => acc + l.launches.length, 0),
      ),
      successRate: computed(() => 100),
      selectedLaunchCount: computed(() => launchesSignal().length),
      selectedSuccessCount: computed(
        () => launchesSignal().filter((l) => l.success === true).length,
      ),
      selectedFailureCount: computed(
        () => launchesSignal().filter((l) => l.success === false).length,
      ),
      selectedSuccessRate: computed(() => 0),
      getLaunchpads: vi.fn().mockReturnValue(of(mockLaunchpads)),
    };

    await TestBed.configureTestingModule({
      imports: [LaunchpadExplorer],
      providers: [
        { provide: Launchpads, useValue: launchpadServiceMock },
        provideHttpClient(),
        provideAnimationsAsync(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LaunchpadExplorer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load launchpads on init', () => {
    const explorer = component as unknown as { launchpadService: Launchpads };
    expect(explorer.launchpadService.launchpads()).toEqual(mockLaunchpads);
    expect(explorer.launchpadService.loading()).toBe(false);
  });

  it('should compute stats correctly', () => {
    const explorer = component as unknown as { launchpadService: Launchpads };
    expect(explorer.launchpadService.activeCount()).toBe(1);
    expect(explorer.launchpadService.lLaunches()).toBe(2);
    expect(explorer.launchpadService.successRate()).toBe(100);
  });

  
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { Launchpads } from '../../services/spacex/launchpads';
import { Launches } from '../../services/spacex/launches';
import { Launchpad } from '../../model/spacex/launchpad.model';
import { SpaceXClient } from './spacex-client';
import { TestBed } from '@angular/core/testing';

describe('SpaceX Launchpad and Launches Client Service', () => {
  let launchpadService: Launchpads;
  let launchesService: Launches;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let spacexClientMock: { get: any; post: any };

  beforeEach(() => {
    spacexClientMock = {
      get: vi.fn(),
      post: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [Launchpads, Launches, { provide: SpaceXClient, useValue: spacexClientMock }],
    });

    launchpadService = TestBed.inject(Launchpads);
    launchesService = TestBed.inject(Launches);
  });

  it('should fetch launchpads from the correct URL', () => {
    const mockData: Launchpad[] = [{ id: '1', name: 'Pad 1' } as Launchpad];
    spacexClientMock.get.mockReturnValue(of(mockData));

    launchpadService.getLaunchpads().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    expect(spacexClientMock.get).toHaveBeenCalledWith('/launchpads');
  });

  it('should handle errors gracefully', () => {
    spacexClientMock.get.mockReturnValue(throwError(() => new Error('API Error')));

    launchpadService.getLaunchpads().subscribe({
      error: (err) => {
        expect(err.message).toBe('API Error');
      },
    });
  });
});

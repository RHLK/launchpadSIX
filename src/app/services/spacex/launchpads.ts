import { inject, Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Launchpad } from '../../model/spacex/launchpad.model';
import { SpaceXClient } from './spacex-client';
import { ApiStatus } from '../../model/spacex/apiStatus.model';

/**
 * SpaceX API Service
 * Handles data fetching Launchpads from the SpaceX public API.
 */
@Injectable({
  providedIn: 'root',
})
export class Launchpads {
  protected spaceXClient = inject(SpaceXClient);

  /**
   * Shared signal for launchpads data, accessible by any component.
   */
  launchpads = signal<Launchpad[]>([]);
  loading = signal(false);
  // Launchpads spacex api status data.
  apiStatus = signal<ApiStatus>(ApiStatus.CHECKING);

  /**
   * Shared computed signals for telemetry statistics.
   * */
  lLaunches = computed(() => this.launchpads().reduce((acc, l) => acc + l.launches.length, 0));
  successRate = computed(() => {
    const total = this.launchpads().reduce(
      (acc: number, l: Launchpad) => acc + l.launch_attempts,
      0,
    );
    const success = this.launchpads().reduce(
      (acc: number, l: Launchpad) => acc + l.launch_successes,
      0,
    );
    return total > 0 ? Math.round((success / total) * 100) : 0;
  });

  activeCount = computed(() => this.launchpads().filter((l) => l.status === 'active').length);

  /**
   * Fetches all SpaceX launchpads and updates the shared signal.
   * @returns An Observable of Launchpad array.
   */
  getLaunchpads(): Observable<Launchpad[]> {
    this.loading.set(true);
    this.apiStatus.set(ApiStatus.CHECKING);
    return this.spaceXClient.get<Launchpad[]>('/launchpads').pipe(
      tap({
        next: (data: Launchpad[]) => {
          this.launchpads.set(data);
          this.loading.set(false);
          this.apiStatus.set(ApiStatus.ONLINE);
        },
        error: () => {
          this.loading.set(false);
          this.apiStatus.set(ApiStatus.OFFLINE);
        },
      }),
    );
  }
}

import { inject, Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Launchpad } from '../model/launchpad.model';
import { SpaceXClient } from './spacex-client';

/**
 * SpaceX API Service
 * Handles data fetching from the SpaceX public API.
 */
@Injectable({
  providedIn: 'root'
})
export class Launchpads {

  protected spaceXClient = inject(SpaceXClient);

  /**
   * Shared signal for launchpads data, accessible by any component.
   */
  launchpads = signal<Launchpad[]>([]);
  loading = signal(false);

  /**
   * Shared computed signals for telemetry statistics.
   * */
lLaunches = computed(() => this.launchpads().reduce((acc, l) => acc + l.launches.length, 0));
  successRate = computed(() => {
    const total = this.launchpads().reduce((acc: number, l: Launchpad) => acc + l.launch_attempts, 0);
    const success = this.launchpads().reduce((acc: number, l:Launchpad) => acc + l.launch_successes, 0);
    return total > 0 ? Math.round((success / total) * 100) : 0;
  });

  /**
   * Fetches all SpaceX launchpads and updates the shared signal.
   * @returns An Observable of Launchpad array.
   */
  getLaunchpads(): Observable<Launchpad[]> {
    this.loading.set(true);
    return this.spaceXClient.get<Launchpad[]>('/launchpads').pipe(
      tap((data: Launchpad[]) => {
        this.launchpads.set(data);
        this.loading.set(false);
      })
    );
  }
}

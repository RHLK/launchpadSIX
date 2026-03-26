import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Launchpad } from '../model/launchpad.model';


/**
 * SpaceX API Service
 * Handles data fetching from the SpaceX public API.
 */
@Injectable({
  providedIn: 'root'
})
export class Launchpads {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.spacexdata.com/latest';

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
    const total = this.launchpads().reduce((acc, l) => acc + l.launch_attempts, 0);
    const success = this.launchpads().reduce((acc, l) => acc + l.launch_successes, 0);
    return total > 0 ? Math.round((success / total) * 100) : 0;
  });

  /**
   * Fetches all SpaceX launchpads and updates the shared signal.
   * @returns An Observable of Launchpad array.
   */
  getLaunchpads(): Observable<Launchpad[]> {
    this.loading.set(true);
    return this.http.get<Launchpad[]>(`${this.baseUrl}/launchpads`).pipe(
      tap(data => {
        this.launchpads.set(data);
        this.loading.set(false);
      })
    );
  }
}

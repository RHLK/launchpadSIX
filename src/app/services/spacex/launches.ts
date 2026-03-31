import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SpaceXClient } from './spacex-client';
import { Launch } from '../../model/spacex/launch.model';
import { QueryResponse } from '../../model/spacex/queryRespone.model';
import { ApiStatus } from '../../model/spacex/apiStatus.model';

/**
 * SpaceX API Service
 * Handles data fetching Launches from the SpaceX public API.
 */
@Injectable({
  providedIn: 'root',
})
export class Launches {
  protected spaceXClient = inject(SpaceXClient);
  /**
   * Shared signal for launchpads data, accessible by any component.
   */
  launches = signal<Launch[]>([]);
  loadingLaunches = signal(false);
  // Launches spacex api status data.
  apiStatus = signal<ApiStatus>(ApiStatus.CHECKING);
  /**
   * Computed signals for currently loaded launches (filtered by query).
   * Filter non upcoming launches for the summary stats, but keep all launches in the main list for display and filtering purposes.
   */
  historicalLaunches = computed(() => this.launches().filter((l) => l.upcoming === false));
  selectedLaunchCount = computed(() => this.historicalLaunches().length);
  selectedSuccessCount = computed(
    () => this.historicalLaunches().filter((l) => l.success === true).length,
  );
  selectedFailureCount = computed(
    () => this.historicalLaunches().filter((l) => l.success === false).length,
  );
  selectedUpcomingCount = computed(() => this.launches().filter((l) => l.upcoming === true).length);

  selectedSuccessRate = computed(() => {
    const total = this.selectedLaunchCount();
    const success = this.selectedSuccessCount();
    return total > 0 ? Math.round((success / total) * 100) : 0;
  });

  /**
   * Fetches all SpaceX launches and updates the shared signal.
   * @returns An Observable of Launch array.
   */
  getLaunches(): Observable<Launch[]> {
    this.loadingLaunches.set(true);
    this.apiStatus.set(ApiStatus.CHECKING);
    return this.spaceXClient.get<Launch[]>('/launches').pipe(
      tap({
        next: (data) => {
          this.launches.set(this.mapLaunches(data));
          this.loadingLaunches.set(false);
          this.apiStatus.set(ApiStatus.ONLINE);
        },
        error: () => {
          this.loadingLaunches.set(false);
          this.apiStatus.set(ApiStatus.OFFLINE);
        },
      }),
    );
  }

  /**
   * Queries SpaceX launches using the /launches/query endpoint.
   * @param query The query object (mongo-style).
   * @param options The pagination and sorting options.
   * @returns An Observable of QueryResponse containing the launches.
   */
  queryLaunches(
    query: Record<string, unknown> = {},
    options: Record<string, unknown> = {},
  ): Observable<QueryResponse<Launch>> {
    this.loadingLaunches.set(true);
    return this.spaceXClient
      .post<QueryResponse<Launch>>('/launches/query', { query, options })
      .pipe(
        tap((response) => {
          this.launches.set(this.mapLaunches(response.docs));
          this.loadingLaunches.set(false);
        }),
      );
  }

  /**
   * Maps an array of raw launch objects to include a status field.
   * @param launches The array of raw launch objects.
   * @returns The array of mapped launch objects.
   */
  private mapLaunches(launches: Partial<Launch>[]): Launch[] {
    return launches.map((l) => ({
      ...l,
      status: l.upcoming ? 'Upcoming' : l.success ? 'Success' : 'Failure',
    })) as Launch[];
  }
}

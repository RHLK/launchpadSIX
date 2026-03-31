import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ArtemisClient } from '../spacex/artemis-client';
import { RocketLaunch } from '../../model/artemis/rocket-launch.model';

/**
 * SpaceX API Service
 * Handles data fetching Launches from the SpaceX public API.
 */
@Injectable({
  providedIn: 'root',
})
export class ArtemisLaunch {
  protected artemisClient = inject(ArtemisClient);
  artemisLaunch = signal<RocketLaunch | null>(null);
  /**
   * Fetches Artemis launch data from RocketLaunch.Live API.
   * @returns An Observable of RocketLaunch object.
   */
  getLaunchByName(launchName: string): Observable<RocketLaunch | null> {
    return this.artemisClient.get<{ result: RocketLaunch[] }>('/launches/next/5').pipe(
      map((response: any) => {
        if (!response || !Array.isArray(response.result)) return null;
        const artemis = response.result
          .filter((l: any) => l && typeof l === 'object' && l.id)
          .find((l: any) => l.name.includes(launchName));
        if (artemis) {
          this.artemisLaunch.set(artemis);
        }
        return artemis || null;
      }),
    );
  }
}

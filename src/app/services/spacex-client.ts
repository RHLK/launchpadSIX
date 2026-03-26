import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

/**
 * Specialized HTTP Client for SpaceX API
 * Automatically prepends the base URL from the environment configuration.
 */
@Injectable({
  providedIn: 'root'
})
export class SpaceXClient {
  private http = inject(HttpClient);
  private baseUrl = environment.spacexApiUrl;

  /**
   * Performs a GET request to the SpaceX API.
   * @param path The API endpoint path (e.g., '/launchpads').
   * @returns An Observable of the response body.
   */
  get<T>(path: string): Observable<T> {
    // Ensure path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return this.http.get<T>(`${this.baseUrl}${normalizedPath}`);
  }
}

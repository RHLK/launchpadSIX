import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

/**
 * Specialized HTTP Client for SpaceX API
 * Automatically prepends the base URL from the environment configuration.
 */
@Injectable({
  providedIn: 'root',
})
export class ArtemisClient {
  private http = inject(HttpClient);
  private baseUrl = environment.artemisApiUrl;

  /**
   * Performs a GET request to the Artemis API.
   * @param path The API endpoint path (e.g., '/launches/next/5').
   * @returns An Observable of the response body.
   */
  get<T>(path: string): Observable<T> {
    // Ensure path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return this.http.get<T>(`${this.baseUrl}${normalizedPath}`);
  }

}

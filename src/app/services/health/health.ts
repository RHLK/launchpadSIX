import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';

export enum HealthStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  CHECKING = 'CHECKING',
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

@Injectable({
  providedIn: 'root',
})
export class Health {
  private http = inject(HttpClient);

  status = signal<HealthStatus>(HealthStatus.CHECKING);
  lastResponse = signal<HealthResponse | null>(null);

  checkHealth() {
    this.status.set(HealthStatus.CHECKING);
    return this.http.get<HealthResponse>('/health').pipe(
      tap((response) => {
        this.status.set(HealthStatus.UP);
        this.lastResponse.set(response);
      }),
      catchError(() => {
        this.status.set(HealthStatus.DOWN);
        this.lastResponse.set(null);
        return of(null);
      }),
    );
  }
}

import { Component, inject, signal, computed, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ArtemisLaunch } from '../../services/artemis/artemis-launch';
import { formatCountdown, formatToZurichTime } from '../../utils/date-utils';

@Component({
  selector: 'app-launch',
  imports: [MatIconModule, CommonModule],
  template: `
    @if (artemisLaunchService.artemisLaunch(); as artemis) {
      <div class="group relative">
        <button
          class="mission-nav-link bg-mission-accent/10 border-mission-accent/50 hover:bg-mission-accent/20 hover:border-mission-accent group/btn animate-pulse-subtle flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 shadow-[0_0_15px_rgba(242,125,38,0.15)] transition-all duration-500 hover:shadow-[0_0_25px_rgba(242,125,38,0.4)]"
          (click)="toggleArtemisInfo()"
        >
          <mat-icon
            class="text-mission-accent !text-[20px] drop-shadow-[0_0_8px_rgba(242,125,38,0.6)]"
            >timer</mat-icon
          >
          <span
            class="text-mission-accent text-sm font-bold tracking-wider uppercase drop-shadow-[0_0_5px_rgba(242,125,38,0.3)]"
            >Artemis: {{ countdown() }}</span
          >
        </button>

        <!-- Artemis Info Dropdown -->
        @if (showArtemisInfo()) {
          <div
            class="bg-mission-ink border-mission-ink/20 animate-in fade-in slide-in-from-top-2 absolute top-full right-0 z-[1100] mt-2 w-80 rounded-sm border p-4 shadow-2xl duration-200"
          >
            <div class="flex flex-col gap-3">
              <div class="flex items-center justify-between">
                <h3 class="text-mission-bg font-display text-lg font-bold">{{ artemis.name }}</h3>
                <a
                  href="https://en.wikipedia.org/wiki/Artemis_II"
                  target="_blank"
                  class="text-mission-accent flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase hover:underline"
                >
                  <img
                    src="assets/Artemis_II_patch.png"
                    alt="Artemis II Mission Patch"
                    class="h-6 w-auto"
                    referrerpolicy="no-referrer"
                  />
                </a>
              </div>

              <p class="text-mission-bg/60 text-xs leading-relaxed italic">
                {{ artemis.launch_description }}
              </p>

              <div class="border-mission-bg/10 grid grid-cols-2 gap-2 border-t pt-2">
                <div class="flex flex-col">
                  <span class="text-mission-bg/40 text-[9px] tracking-tighter uppercase"
                    >Vehicle</span
                  >
                  <span class="text-mission-bg font-mono text-xs">{{ artemis.vehicle.name }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-mission-bg/40 text-[9px] tracking-tighter uppercase"
                    >Destination</span
                  >
                  <span class="text-mission-bg font-mono text-xs">The Moon (Exosphere)</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-mission-bg/40 text-[9px] tracking-tighter uppercase"
                    >Provider</span
                  >
                  <span class="text-mission-bg font-mono text-xs">{{ artemis.provider.name }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-mission-bg/40 text-[9px] tracking-tighter uppercase"
                    >Date (UTC)</span
                  >
                  <span class="text-mission-bg font-mono text-xs">{{ artemis.date_str }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-mission-bg/40 text-[9px] tracking-tighter uppercase"
                    >Date (Zurich)</span
                  >
                  <span class="text-mission-bg font-mono text-xs">{{
                    formatToZurichTime(artemis.win_open)
                  }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-mission-bg/40 text-[9px] tracking-tighter uppercase"
                    >Location</span
                  >
                  <span class="text-mission-bg font-mono text-xs">{{
                    artemis.pad.location.name
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class Launch implements OnDestroy {
  artemisLaunchService = inject(ArtemisLaunch);
  currentTime = signal(Date.now());
  showArtemisInfo = signal(false);
  formatToZurichTime = formatToZurichTime;
  private timer: any;

  constructor() {
    this.artemisLaunchService.getLaunchByName('Artemis').subscribe();
    this.timer = setInterval(() => {
      this.currentTime.set(Date.now());
    }, 1000);
  }

  countdown = computed(() => {
    const artemis = this.artemisLaunchService.artemisLaunch();
    return formatCountdown(artemis?.win_open, this.currentTime());
  });

  toggleArtemisInfo() {
    this.showArtemisInfo.update((v) => !v);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}

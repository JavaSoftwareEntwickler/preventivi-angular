import { Component, HostListener, OnInit, signal } from '@angular/core';
import { LeftSidebar } from './left-sidebar/left-sidebar';
import { Main } from './main/main';
import { BREAKPOINT_SMALL } from './shared/helper/constants';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [LeftSidebar, Main],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App implements OnInit {
    isLeftSidebarCollapsed = signal<boolean>(false);
    screenWidth = signal<number>(window.innerWidth);

    @HostListener('window:resize')
    onResize() {
        this.screenWidth.set(window.innerWidth);
        if (this.screenWidth() < BREAKPOINT_SMALL) {
            this.isLeftSidebarCollapsed.set(true);
        } else {
            this.isLeftSidebarCollapsed.set(false);
        }
    }

    ngOnInit(): void {
        this.isLeftSidebarCollapsed.set(this.screenWidth() < BREAKPOINT_SMALL);
    }

    changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
        this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
    }
}

import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BREAKPOINT_SMALL } from '../shared/helper/constants';
import { LoadingBar } from "../preventivo/components/loading-bar/loading-bar";

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [RouterOutlet, CommonModule, LoadingBar],
    templateUrl: './main.html',
    styleUrl: './main.css',
})
export class Main {
    isLeftSidebarCollapsed = input.required<boolean>();
    screenWidth = input.required<number>();
    sizeClass = computed(() => {
        const isLeftSidebarCollapsed = this.isLeftSidebarCollapsed();
        if (isLeftSidebarCollapsed) {
            return '';
        }
        return this.screenWidth() > BREAKPOINT_SMALL ? 'body-trimmed' : 'body-md-screen';
    });
}

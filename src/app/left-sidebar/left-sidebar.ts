import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CollapseOnNavigateDirective } from './collapse-on-navigate.directive';

@Component({
    selector: 'app-left-sidebar',
    standalone: true,
    imports: [RouterModule, CommonModule, CollapseOnNavigateDirective],
    templateUrl: './left-sidebar.html',
    styleUrl: './left-sidebar.css',
})
export class LeftSidebar {
    isLeftSidebarCollapsed = input.required<boolean>();
    changeIsLeftSidebarCollapsed = output<boolean>();
    items = [
        {
            routeLink: 'dashboard',
            icon: 'fal fa-home',
            label: 'Dashboard',
            disabled: false,
        },
        {
            routeLink: 'preventivo',
            icon: 'fal fa-file',
            label: 'Preventivi',
            disabled: false,
        },
        {
            routeLink: 'pages',
            icon: 'fal fa-box-open',
            label: 'Prodotti',
            disabled: true,
        },
        {
            routeLink: 'settings',
            icon: 'fal fa-cog',
            label: 'Settings',
            disabled: true,
        },
    ];

    toggleCollapse(): void {
        this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
    }

    closeSidenav(): void {
        this.changeIsLeftSidebarCollapsed.emit(true);
    }
}

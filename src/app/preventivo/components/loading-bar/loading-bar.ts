import { Component, Input, signal } from '@angular/core';
import { PreventivoManagementService } from '../../services/preventivo-managment.service';

@Component({
    selector: 'app-loading-bar',
    standalone: true,
    imports: [],
    templateUrl: './loading-bar.html',
    styleUrl: './loading-bar.css',
})
export class LoadingBar {
    constructor(public preventivoService: PreventivoManagementService) {

    }

}
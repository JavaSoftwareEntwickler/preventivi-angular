import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventiviService } from '../../services/preventivi.service';


@Component({
    selector: 'app-preventivo-search-bar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './search-bar.html',
    styleUrls: ['./search-bar.css']
})
export class PreventivoSearchBar {
    constructor(public svc: PreventiviService) { }
}
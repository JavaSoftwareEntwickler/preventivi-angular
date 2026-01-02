import { Component, effect, inject } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { DashboardService } from './dashboard.service';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [NgChartsModule, DecimalPipe, FormsModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class Dashboard {

    constructor(public dashboardService: DashboardService) {
        effect(() => {
            this.pieChartData = {
                ...this.pieChartData,
                datasets: [{
                    ...this.pieChartData.datasets[0],
                    data: this.dashboardService.pieChartData()
                }]
            };

            this.barChartData = {
                ...this.barChartData,
                datasets: [{
                    ...this.barChartData.datasets[0],
                    data: this.dashboardService.barChartData()
                }]
            };

            this.lineChartData = {
                ...this.lineChartData,
                datasets: [{
                    ...this.lineChartData.datasets[0],
                    data: this.dashboardService.lineChartData()
                }]
            };
        });
    }

    // Nel componente dashboard.ts
    get selectedYear() {
        return this.dashboardService.selectedYear();
    }

    set selectedYear(value: number) {
        this.dashboardService.selectedYear.set(value);
    }
    /* =======================
       CHART TYPES
    ======================= */

    doughnutChartType: ChartType = 'doughnut';
    barChartType: ChartType = 'bar';
    lineChartType: ChartType = 'line';

    /* =======================
       KPI (binding diretto)
    ======================= */

    get totale() { return this.dashboardService.totalPreventivi(); }
    get aperti() { return this.dashboardService.aperti(); }
    get accettati() { return this.dashboardService.accettati(); }
    get rifiutati() { return this.dashboardService.rifiutati(); }

    get valoreTotale() { return this.dashboardService.valoreTotale(); }
    get valoreAccettati() { return this.dashboardService.valoreAccettati(); }
    get valoreMedio() { return this.dashboardService.valoreMedio(); }

    get ultimi30() { return this.dashboardService.ultimi30Giorni(); }
    get tassoAccettazione() { return this.dashboardService.tassoAccettazione(); }

    /* =======================
       PIE
    ======================= */

    pieChartLabels = ['Aperti', 'Accettati', 'Rifiutati'];
    pieChartData: {
        labels: string[];
        datasets: {
            data: number[];
            backgroundColor: string[];
        }[];
    } = {
            labels: this.pieChartLabels,
            datasets: [{
                data: [],
                backgroundColor: ['#f5a623', '#077711', '#d62828']
            }]
        };

    pieChartOptions = { responsive: true, maintainAspectRatio: false };

    /* =======================
       BAR
    ======================= */

    barChartLabels = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    barChartData: {
        labels: string[];
        datasets: {
            data: number[];
            label: string;
            backgroundColor: string;
        }[];
    } = {
            labels: this.barChartLabels,
            datasets: [{
                data: [],
                label: '€',
                backgroundColor: '#012a5b'
            }]
        };

    barChartOptions = { responsive: true, maintainAspectRatio: false };

    /* =======================
       LINE
    ======================= */

    lineChartLabels = this.barChartLabels;
    lineChartData: {
        labels: string[];
        datasets: {
            data: number[];
            label: string;
            borderColor: string;
            backgroundColor: string;
            fill: boolean;
            tension: number;
        }[];
    } = {
            labels: this.lineChartLabels,
            datasets: [{
                data: [],
                label: 'Preventivi',
                borderColor: '#012a5b',
                backgroundColor: 'rgba(1,42,91,0.2)',
                fill: true,
                tension: 0.4
            }]
        };

    lineChartOptions = { responsive: true, maintainAspectRatio: false };
}

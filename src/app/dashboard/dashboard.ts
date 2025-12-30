import { Component } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [NgChartsModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class Dashboard {
    doughnutChartType: ChartType = 'doughnut';  // valori possibili: 'pie', 'doughnut', 'bar', 'line', ecc.
    barChartType: ChartType = 'bar';
    lineChartType: ChartType = 'line';

    pieChartLabels: string[] = ['Aperti', 'Accettati', 'Rifiutati'];
    pieChartData = {
        labels: this.pieChartLabels,
        datasets: [{ data: [42, 61, 25], backgroundColor: ['#f5a623', '#077711', '#d62828'] }]
    };
    pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
    };

    barChartLabels: string[] = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    barChartData = {
        labels: this.barChartLabels,
        datasets: [{ data: [45000, 72000, 81000, 96000, 123000, 45000, 72000, 81000, 96000, 123000, 34334, 34444], label: '€', backgroundColor: '#012a5b' }]
    };
    barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
    };

    lineChartLabels: string[] = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    lineChartData = {
        labels: this.lineChartLabels,
        datasets: [
            {
                data: [8, 14, 18, 22, 28, 28, 29, 30, 36, 39, 40, 41],
                label: 'Preventivi',
                borderColor: '#012a5b',
                backgroundColor: 'rgba(1,42,91,0.2)',
                fill: true,
                tension: 0.4
            }
        ]
    };
    lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
    };
}

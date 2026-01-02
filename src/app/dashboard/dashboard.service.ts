import { Injectable, Signal, computed, effect, inject, signal } from '@angular/core';
import { PreventivoManagementService } from '../preventivo/services/preventivo-managment.service';
import { StatoPreventivo } from '../preventivo/models/stato-preventivo.model';
import { PreventivoModel } from '../preventivo/models/preventivo-model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private preventivoService = inject(PreventivoManagementService);

    private _preventivi!: Signal<PreventivoModel[]>;
    private readonly currentYear = new Date().getFullYear();
    /** Flag versione Pro */
    isProVersion = true;
    /** Anno selezionato dall’utente (solo se Pro) */
    selectedYear = signal(new Date().getFullYear());

    private preventivi!: Signal<PreventivoModel[]>;
    constructor() {
        // Prendo tutti i preventivi dal service
        this._preventivi = this.preventivoService.preventivi;

        // Computed reattivo: se è Pro, filtra per selectedYear, altrimenti anno corrente
        this.preventivi = computed(() => {
            const annoFiltro = this.isProVersion ? this.selectedYear() : this.currentYear;
            // filtro preventivi
            return this._preventivi().filter(p => {
                const annoPreventivo = p.dataPreventivo.toString().substring(0, 4);
                return annoPreventivo === annoFiltro.toString();
            });
        });

        // Effetto opzionale per debug o trigger di side-effect quando cambia l'anno
        effect(() => {
            console.log('Anno selezionato:', this.selectedYear(), 'Preventivi filtrati:', this.preventivi().length);
        });
    }

    /** Lista anni disponibile dinamica */
    availableYears = computed(() => {
        const preventivi = this._preventivi();
        if (!preventivi || preventivi.length === 0) return [new Date().getFullYear()];

        const anniDB = preventivi.map(p => new Date(p.dataPreventivo).getFullYear());
        const max = Math.max(...anniDB, new Date().getFullYear());
        const min = Math.min(...anniDB, 2023); // puoi partire dal primo anno disponibile
        const years: number[] = [];
        for (let y = max; y >= min; y--) years.push(y);
        return years;
    });

    /* =======================
       KPI PREVENTIVI
    ======================= */

    totalPreventivi = computed(() =>
        this.preventivi().length
    );

    aperti = computed(() =>
        this.preventivi().filter(p => p.stato === StatoPreventivo.APERTO).length
    );

    accettati = computed(() =>
        this.preventivi().filter(p => p.stato === StatoPreventivo.ACCETTATO).length
    );

    rifiutati = computed(() =>
        this.preventivi().filter(p => p.stato === StatoPreventivo.RIFIUTATO).length
    );

    /* =======================
       KPI ECONOMICI
    ======================= */

    valoreTotale = computed(() =>
        this.preventivi().reduce((sum, p) => sum + p.importoTotale, 0)
    );

    valoreAccettati = computed(() =>
        this.preventivi()
            .filter(p => p.stato === StatoPreventivo.ACCETTATO)
            .reduce((sum, p) => sum + p.importoTotale, 0)
    );

    valoreMedio = computed(() => {
        const tot = this.totalPreventivi();
        return tot === 0 ? 0 : Math.round(this.valoreTotale() / tot);
    });

    /* =======================
       DATI PER GRAFICI
    ======================= */

    pieChartData = computed(() => ([
        this.aperti(),
        this.accettati(),
        this.rifiutati()
    ]));

    /** Valore mensile (anno corrente) */
    barChartData = computed(() => {
        const mesi = Array(12).fill(0);

        this.preventivi().forEach(p => {
            const mese = new Date(p.dataPreventivo).getMonth();
            mesi[mese] += p.importoTotale;
        });

        return mesi;
    });

    /** Trend numero preventivi */
    lineChartData = computed(() => {
        const mesi = Array(12).fill(0);

        this.preventivi().forEach(p => {
            const mese = new Date(p.dataPreventivo).getMonth();
            mesi[mese]++;
        });

        return mesi;
    });

    tassoAccettazione = computed(() => {
        const tot = this.totalPreventivi();
        return tot === 0 ? 0 : Math.round((this.accettati() / tot) * 100);
    });

    ultimi30Giorni = computed(() => {
        const now = new Date().getTime();
        const trentaGiorni = 30 * 24 * 60 * 60 * 1000;

        return this.preventivi().filter(p =>
            now - new Date(p.dataPreventivo).getTime() <= trentaGiorni
        ).length;
    });
}

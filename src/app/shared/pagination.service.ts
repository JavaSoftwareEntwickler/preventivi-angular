import { computed, effect, Injectable, Signal, signal } from '@angular/core';
import { PreventivoModel } from '../preventivo/models/preventivo-model';
import { PreventiviService } from '../preventivo/services/preventivi.service';

@Injectable({ providedIn: 'root' })
export class PaginationService<T> {
  // search / sort / pagination
  searchTerm = signal<string>('');
  sortColumn = signal<string>('id');
  sortDirection = signal<'asc' | 'desc'>('asc');
  pageSize = 5;
  currentPage = signal<number>(1);
  private _data = signal<T[]>([]);

  constructor() { }

  /**
 * Collegamento dei dati reattivi
 * @param dataSignal Signal esterno contenente i dati
 */
  setData(dataSignal: Signal<T[]>) {
    effect(() => {
      this._data.set(dataSignal());
      this.currentPage.set(1); // reset page quando i dati cambiano
    });
  }

  // computed
  filtered = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return this._data().filter((item: any) =>
      Object.values(item).some(v => String(v).toLowerCase().includes(q))
    );
  });

  sorted = computed(() => {
    const col = this.sortColumn();
    const dir = this.sortDirection();
    return [...this.filtered()].sort((a: any, b: any) => {
      if (a[col] < b[col]) return dir === 'asc' ? -1 : 1;
      if (a[col] > b[col]) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  });

  paginated = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.sorted().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.sorted().length / this.pageSize)));

  // effects: keep current page valid when filtered size changes
  private _sync = effect(() => {
    const tp = this.totalPages();
    if (this.currentPage() > tp) this.currentPage.set(tp);
  });

  // API methods
  setSearch(value: string) { this.searchTerm.set(value); this.currentPage.set(1); }

  changeSort(col: string) {
    if (this.sortColumn() === col) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(col);
      this.sortDirection.set('asc');
    }
  }
  goToPage(page: number) { if (page > 0 && page <= this.totalPages()) this.currentPage.set(page); }
}


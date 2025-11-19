import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PreventivoModel {
  id: number;
  nomeCliente: string;
  dataPreventivo: string;
  importoTotale: number;
}

@Component({
  selector: 'app-preventivo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preventivo.html',
  styleUrl: './preventivo.css',
})
export class Preventivo {

  // Mock iniziali
  preventivi = signal<PreventivoModel[]>([
    { id: 1, nomeCliente: 'Mario Rossi', dataPreventivo: '2025-01-14', importoTotale: 1200.50 },
    { id: 2, nomeCliente: 'Azienda Bianchi asdfasdfasdfasdf SRL', dataPreventivo: '2025-01-18', importoTotale: 4500.00 },
    { id: 3, nomeCliente: 'Luca Verdi', dataPreventivo: '2025-02-03', importoTotale: 890.00 },
    { id: 4, nomeCliente: 'Studio Gamma', dataPreventivo: '2025-02-10', importoTotale: 2300.00 },
    { id: 5, nomeCliente: 'Sigma Love', dataPreventivo: '2025-02-6', importoTotale: 700.00 },
    { id: 6, nomeCliente: 'Sigma Pippo', dataPreventivo: '2025-08-2', importoTotale: 1230.00 },
    { id: 7, nomeCliente: 'Sigma Rozzo', dataPreventivo: '2025-08-12', importoTotale: 5235120.00 },
    { id: 8, nomeCliente: 'Gino Ginello', dataPreventivo: '2025-09-12', importoTotale: 534560.00 },
    { id: 9, nomeCliente: 'Ciccio Pasticcio', dataPreventivo: '2025-09-12', importoTotale: 5103450.00 },
    { id: 10, nomeCliente: 'Love you', dataPreventivo: '2025-10-12', importoTotale: 5103330.00 },
    { id: 11, nomeCliente: 'I am', dataPreventivo: '2025-11-12', importoTotale: 151890.00 }
  ]);

  // Search
  searchTerm = signal<string>('');

  // Sorting
  sortColumn = signal<string>('id');
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Pagination
  pageSize = 5;
  currentPage = signal<number>(1);

  // Modale
  showDetails = signal(false);
  selectedPreventivo = signal<PreventivoModel | null>(null);

  // --- Computed per filtri + sorting + paginazione ---
  filtered = computed(() => {
    const query = this.searchTerm().toLowerCase();
    return this.preventivi().filter(p =>
      p.nomeCliente.toLowerCase().includes(query)
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

  totalPages = computed(() =>
    Math.ceil(this.sorted().length / this.pageSize)
  );

  // --- Metodi ---

  changeSort(column: string) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  openDetails(p: PreventivoModel) {
    this.selectedPreventivo.set(p);
    this.showDetails.set(true);
  }

  closeDetails() {
    this.showDetails.set(false);
    this.selectedPreventivo.set(null);
  }

  nuovoPreventivo() {
    alert('Funzionalità da implementare: apertura form nuovo preventivo');
  }

}

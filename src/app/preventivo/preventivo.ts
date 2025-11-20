import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface PreventivoModel {
  id: number;
  nomeCliente: string;
  dataPreventivo: string;
  importoTotale: number;
}

@Component({
  selector: 'app-preventivo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './preventivo.html',
  styleUrl: './preventivo.css',
})
export class Preventivo {
  pageMode = signal<'list' | 'detail'>('list');
  // Form minimale aggiunto
  formPreventivo: FormGroup;
  isEditing = signal<boolean>(false);

  constructor(private fb: FormBuilder) {
    this.formPreventivo = this.fb.group({
      id: [{ value: '', disabled: true }], 
      nomeCliente: [{ value: '', disabled: true }, Validators.required],
      dataPreventivo: [{ value: '', disabled: true }, Validators.required],
      importoTotale: [{ value: '', disabled: true }, [Validators.required, Validators.min(0)]]
    });
  }
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

  // Edit
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

  // --- modificato per popolare il form ---
  openDetails(p: PreventivoModel) {
    this.selectedPreventivo.set(p);
    this.pageMode.set('detail');
    this.isEditing.set(false);

    this.formPreventivo.patchValue({
      id: p.id,
      nomeCliente: p.nomeCliente,
      dataPreventivo: p.dataPreventivo,
      importoTotale: p.importoTotale
    });

    this.formPreventivo.disable();  // ← readonly
  }

  backToList() {
    this.pageMode.set('list');
    this.selectedPreventivo.set(null);
  }

  savePreventivo() {
    if (!this.selectedPreventivo()) return;

    const updated: PreventivoModel = {
      ...this.selectedPreventivo()!,
      ...this.formPreventivo.getRawValue() // prende anche disabled fields
    };

    this.preventivi.set(
      this.preventivi().map(p => p.id === updated.id ? updated : p)
    );

    this.isEditing.set(false);
    this.formPreventivo.disable();
  }



  nuovoPreventivo() {
    alert('Funzionalità da implementare: apertura form nuovo preventivo');
  }

  printPreventivo(p: PreventivoModel) {
    alert('Funzionalità Generazione PDF da implementare per preventivo ID: ' + p.id);
  }

  editPreventivo() {
    this.isEditing.set(true);
    this.formPreventivo.enable();
    this.formPreventivo.controls['id'].disable(); // L'ID resta sempre non modificabile
  }
  
  cancelEdit() {
    if (!this.selectedPreventivo()) return;

    this.isEditing.set(false);

    // Ripristina i valori originali
    this.formPreventivo.patchValue(this.selectedPreventivo()!);
    this.formPreventivo.disable();
  }

  deletePreventivo(p: PreventivoModel) {
    const conferma = confirm('Confermi di voler eliminare il preventivo ID ' + p.id + '?');

    if (conferma) {
      this.preventivi.set(this.preventivi().filter(x => x.id !== p.id));
    }
  }

}

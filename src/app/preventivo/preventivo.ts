import { Component } from '@angular/core';
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

  preventivi: PreventivoModel[] = [
    {
      id: 1,
      nomeCliente: 'Mario Rossi',
      dataPreventivo: '2025-01-14',
      importoTotale: 1200.50
    },
    {
      id: 2,
      nomeCliente: 'Azienda Bianchi SRL',
      dataPreventivo: '2025-01-18',
      importoTotale: 4500.00
    },
    {
      id: 3,
      nomeCliente: 'Luca Verdi',
      dataPreventivo: '2025-02-03',
      importoTotale: 890.00
    }
  ];

}

import { RighePreventivoModel } from "./righe-preventivo-model";

export interface PreventivoModel {
    id: number;
    nomeCliente: string;
    dataPreventivo: Date;
    importoTotale: number;
    righe: RighePreventivoModel[]
}
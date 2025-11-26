import { RighePreventivoModel } from "./righe-preventivo-model";

export interface PreventivoModel {
    id: number;
    nomeCliente: string;
    dataPreventivo: string;
    importoTotale: number;
    righe: RighePreventivoModel[]
}
import { RighePreventivoModel } from "./righe-preventivo-model";
import { StatoPreventivo } from "./stato-preventivo.model";

export interface PreventivoModel {
    id: number;
    nomeCliente: string;
    indirizzo: string;
    dataPreventivo: Date;
    importoTotale: number;
    stato: StatoPreventivo;
    righe: RighePreventivoModel[]
}

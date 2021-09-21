import { Scholar } from "./scholar";
import { HistoricData } from 'src/app/models/interfaces';

class Historic {

    getDataOneScholarHisctoric(scholars: Scholar[]): HistoricData{
        let historicData: HistoricData = { 
            dias: [], 
            title: `Resultados de ${scholars[0].name}`, 
            slp: [] 
        };
        scholars.forEach((scholar: Scholar)=>{
            historicData.dias.push(scholar.lastUpdate.getDate());
            historicData.slp.push(scholar.todaySLP);
        });
        return historicData
    }
}

export const historic = new Historic();

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

    getTwoMonthHistoric(scholars: Scholar[], fisrt: Date, last: Date): HistoricData{
        let historicData: HistoricData = { 
            dias: [], 
            title: `Desde ${fisrt} hasta ${last}`, 
            slp: []
        };
        let indexHitoric: number = 0;
        let indexScholars: number = 0;
        scholars.forEach((scholar: Scholar, index)=>{
            if(scholars[indexScholars].lastUpdate.getDate() != scholar.lastUpdate.getDate()){
                indexHitoric += 1;
                indexScholars = index;
            }
            if(scholars[indexScholars].lastUpdate.getDate() === scholar.lastUpdate.getDate()){
                historicData.dias[indexHitoric] =  scholar.lastUpdate.getDate();
                if(isNaN(historicData.slp[indexHitoric])){
                    historicData.slp[indexHitoric] = scholar.todaySLP;
                }else{
                    historicData.slp[indexHitoric] += scholar.todaySLP;
                }
            }
        })
        return historicData;
    }

    compareTwoScholar(Scholars: Scholar[], roningAddress: String): HistoricData{
        let historicData: HistoricData = {
            dias: [],
            slp: [],
            title: '',
            historic: {
                dias: [],
                slp: [],
                title: ''
            }
        };
        Scholars.forEach((scholar: Scholar)=>{
            if(roningAddress === scholar.roninAddress){
                historicData.dias.push(scholar.lastUpdate.getDate());
                historicData.slp.push(scholar.todaySLP);
                historicData.title = `scholar ${scholar.name}`;
            }else{
                historicData.historic!.dias.push(scholar.lastUpdate.getDate());
                historicData.historic!.slp.push(scholar.todaySLP);
                historicData.historic!.title = `scholar ${scholar.name}`;
            }
        });
        return historicData;
    }
}

export const historic = new Historic();

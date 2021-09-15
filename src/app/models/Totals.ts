import { Scholar } from "src/app/models/scholar";
import { Historial } from 'src/app/models/interfaces'

class Totals{
    private title: string[] = ['Total Earned', 'Best pvp', 'Total Unclaimed', 'Total Claimed','Yesterday total', 'Partial Today', 'Total Avarage'];

    setHistorial(scholar: Scholar[], historial: Historial[], slpPrice: number): void{
        this.title.forEach(element=>{
            historial.push({ title: element, subTitleNumber: 0, usd: 0 });
        });
        this.setSubTitle(scholar, historial);
        this.slpToUsd(historial, slpPrice);
    };

    private setSubTitle(scholar: Scholar[], historial: Historial[]): void{
        scholar.forEach(element =>{
            this.calculoTotales(element, historial);
        });
        this.calcTotalAverage(historial, scholar);
        this.setBestpvp(scholar, historial);
    };

    private calculoTotales(scholar: Scholar, historial: Historial[]):void{
        if(!isNaN(scholar.totalSLP)) historial[0].subTitleNumber += scholar.totalSLP;
        historial[2].subTitleNumber += scholar.inRoninSLP;
        historial[3].subTitleNumber += scholar.inGameSLP;
        historial[4].subTitleNumber += scholar.yesterdaySLP;
        if(!isNaN(scholar.todaySLP)) historial[5].subTitleNumber += scholar.todaySLP;
        if(!isNaN(scholar.averageSLP)) historial[6].subTitleNumber += scholar.averageSLP;
    }

    private calcTotalAverage(historial: Historial[], scholar: Scholar[]){
        historial[6].subTitleNumber = historial[6].subTitleNumber / scholar.length
    }

    private setBestpvp(scholar: Scholar[], historial: Historial[]): void{
        let newScholar: Scholar[] = [...scholar].filter(e => e.PVPRank != 0);
        historial[1].subTitleNumber = Math.min(...newScholar.map(element => element.PVPRank));
        this.setNameyMmrBestpvp(scholar, historial);
    }

    private setNameyMmrBestpvp(scholar: Scholar[], historial: Historial[]): void{
        scholar.forEach(element => {
            if(element.PVPRank === historial[1].subTitleNumber){
                historial[1].nombre = element.name.toUpperCase();
                historial[1].mmr = element.MMR
            }
        })
    }

    private slpToUsd(historial: Historial[], slp: number){
        historial.forEach(element=>{
            element.usd = parseFloat((element.subTitleNumber * slp).toFixed(2));
        });
    }
}

export const totals = new Totals();
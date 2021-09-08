import { Scholar } from "src/app/models/scholar";
import { Historial } from "./historial";

class Totals{
    private title: string[] = ['Total Earned', 'Best pvp', 'Total Unclaimed', 'Total Claimed',
    'Yesterday total', 'Partial Today', 'Total Avarage'];

    setHistorial(scholar: Scholar[], historial: Historial[], slpPrice: number): void{
        this.title.forEach(element=>{
            historial.push({ title: element, subTitleNumber: 0, usd: 0 });
        });
        this.setSubTitle(scholar, historial);
        this.slpToUsd(historial, slpPrice);
    };

    private setSubTitle(scholar: Scholar[], historial: Historial[]): void{
        scholar.forEach(scholar=>{
            historial[0].subTitleNumber += scholar.totalSLP;
            historial[2].subTitleNumber += scholar.inRoninSLP;
            historial[3].subTitleNumber += scholar.inGameSLP;
            historial[4].subTitleNumber += scholar.yesterdaySLP;
            historial[5].subTitleNumber += scholar.todaySLP;
            historial[6].subTitleNumber += scholar.averageSLP;
        });
        historial[6].subTitleNumber = historial[5].subTitleNumber / scholar.length
        this.setBestpvp(scholar, historial);
    };

    private setBestpvp(scholar: Scholar[], historial: Historial[]): void{
        historial[1].subTitleNumber = Math.min(...scholar.map(element => element.PVPRank));
    }

    private slpToUsd(historial: Historial[], slp: number){
        historial.forEach((element, index)=>{
            element.usd = parseFloat((element.subTitleNumber * slp).toFixed(2));
        });
        console.log(historial)
    }
}

export const totals = new Totals();
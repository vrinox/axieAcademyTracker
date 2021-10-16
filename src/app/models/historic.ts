import { Scholar } from "./scholar";
import { HistoricData, Dataset } from 'src/app/models/interfaces';

class Historic {

    color: string[] = ['#eb2c1e9d','#eb921e9d','#ebc91e9d', '#c9eb1e9d', '#8feb1e9d', '#1eebae9d',
    '#1eebd69d', '#1ea7eb9d', '#1e7eeb9d', '#1e51eb9d', '#211eeb9d', '#471eeb9d', '#5b1eeb9d', 
    '#851eeb9d', '#c21eeb9d', '#eb1eda9d', '#eb1e9c9d', '#eb1e739d'];

    getHistoricPlayer(scholars: Scholar[], ronin: string[]): HistoricData{
        let historic: HistoricData = {
            labelSlp: [],
            dataset: []
        }
        ronin.forEach((ronin_Address: string, index)=>{
            let datahistoric: Dataset = {
                label: '',
                backgroundColor: `${this.color[index]}`,
                borderColor: `${this.color[index]}`,
                borderWidth: 1,
                data: [],
                fill: true
            }
            scholars.forEach((scholar: Scholar)=>{
                if(ronin_Address === scholar.roninAddress){
                    datahistoric.label = scholar.name;
                    datahistoric.data.push(scholar.todaySLP);
                }
            });
            historic.dataset.push(datahistoric);
        });
        historic.labelSlp = this.calcLabelSlp(scholars);
        return historic
    }

    getMontHistoric(scholars: Scholar[], first: Date, last: Date): HistoricData{
        let historic: HistoricData = {
            labelSlp: [],
            dataset: []
        }
        let lastDate: Date = first;
        let datahistoric: Dataset = {
            label: `Desde ${first.getUTCDate()} ${first.getMonth()} hasta ${last.getUTCDate()} mes ${last.getMonth()} año ${first.getFullYear()}`,
            backgroundColor: `${this.color[0]}`,
            borderColor: `${this.color[0]}`,
            borderWidth: 1,
            data: [],
            fill: true
        }
        scholars.forEach((scholar: Scholar)=>{
            if(lastDate.getUTCDate() === scholar.lastUpdate.getUTCDate() 
                && lastDate.getMonth() === scholar.lastUpdate.getMonth()){
                    datahistoric.data[datahistoric.data.length-1] += scholar.todaySLP;
            }else if(lastDate != scholar.lastUpdate){
                datahistoric.data.push(scholar.todaySLP);
            }
            lastDate = scholar.lastUpdate;
        });
        historic.dataset.push(datahistoric);
        historic.labelSlp = this.calcLabelSlp(scholars);
        return historic
    }
    
    private calcLabelSlp(scholars: Scholar[]): number[]{
        let fisrtDate: number = scholars[0].lastUpdate.getDate();
        let lastDate: number = scholars[scholars.length-1].lastUpdate.getDate();
        let label: number[] = [fisrtDate];
        let i: number = 0
        while(label[i] < lastDate+1){
            label.push(label[i]+1);
            i++
        };
        return label;
    }
}

export const historic = new Historic();

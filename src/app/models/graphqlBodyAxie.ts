import { GraphqlBody, Criteria, AxiesData } from './interfaces';
import { Scholar } from 'src/app/models/scholar';
import { A } from '@angular/cdk/keycodes';

class GraphqlBodyAxie{
    private roning?: string;
    private criteria?: Criteria;

    getBodyDetail(Scholar: Scholar): GraphqlBody{
        this.roning = Scholar.roninAddress;
        let body: GraphqlBody = this.body('GetAxieLatest', 'All');
        delete body.variables.criteria
        return body
    }

    getBodyPrice(axiesData: AxiesData): GraphqlBody{
        this.setCriteria(axiesData);
        let body: GraphqlBody = this.body('GetAxieBriefList', 'Sale');
        delete body.variables.owner;
        return body
    }

    private body(operationName: string, auctionType: string): GraphqlBody{
        return {
            "operationName": operationName,
            "variables": {
                "from": 0,
                "size": 24,
                "sort": "PriceAsc",
                "auctionType": auctionType,
                "owner": this.roning,
                "criteria": this.criteria
            },
            "query": `query ${operationName}($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieRowData\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieRowData on Axie {\n  id\n  image\n  class\n  name\n  genes\n  owner\n  class\n  stage\n  title\n  breedCount\n  level\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n`
        }
    }

    private setCriteria(axiesData: AxiesData): void{
        this.criteria = {
            parts: this.parseParts(axiesData),
            breedCount: [0, 7],
            hp: [axiesData!.hp, axiesData!.hp + 1],
            speed: [axiesData!.speed, axiesData!.speed + 1],
            skill: [axiesData!.skill, axiesData!.skill + 1],
            morale: [axiesData!.morale, axiesData!.morale + 1],
            classes: [axiesData.class],
            pureness: this.calculatePureness(axiesData)
        }
    }

    private parseParts(AxiesData: AxiesData): string[]{
        let partsSearch: string[] = [];
        AxiesData.parts.forEach(part=>{
            if(part.type != 'Eyes' && part.type != 'Ears'){
            partsSearch.push(part.type);
            partsSearch.push(part.id);
            }
        });
    return partsSearch
    }
    
    private calculatePureness(AxiesData: AxiesData): number[]{
        interface type{
            class: string,
            acc: number
        }
        let pureness: number[] = [0];
        let classArray: type[]  = [];
        AxiesData.parts.forEach(part=>{
            classArray = classArray.filter( c => c );
            const axieClass = classArray.find( t => t.class === part.class);
            (axieClass)? axieClass.acc++: classArray.push({class: part.class, acc: 1});
        });
        classArray.sort((a, b) => b.acc - a.acc);
        pureness[0] = classArray[0].acc;
        return pureness;
    }
}

export const graphqlBodyAxie = new GraphqlBodyAxie();
import { Axie } from "./axie";

export interface scholarOfficialData {
    ronin_address: string,
    ronin_slp: number,
    total_slp: number,
    in_game_slp: number,
    slp_success?: number,
    rank: number,
    mmr: number,
    total_matches: number,
    win_rate?: string,
    ign: string,
    game_stats_success?: string
    name: string
}

export interface ParseUserData {
    in_game_slp?: number,
    mmr?: number,
    rank?: number,
    ronin_slp?: number,
    total_slp?: number
    name?: string,
    total_matches?: number
}

export interface scholarFirebaseI {
    roninAddress: string,
    name: string;
}

export interface Historial {
    title: string,
    subTitleNumber: number,
    usd?: number,
    nombre?: string,
    mmr?: number
}

export interface DatosFormulario {
    id?: number,
    name: string,
    apellido?: string,
    roninAddress: string,
    personalAdress?: string,
    ganancia?: string
}

export interface HistoricData {
    labelSlp: number[]
    dataset: Dataset[]
}

export interface Dataset {
    label: string,
    data: number[],
    borderColor: string,
    fill: boolean,
    backgroundColor: string,
    borderWidth: number
}

export interface AxiesData {
    roning: string
    namePlayer: string
    price?: string
    eth?: string
    hp: number
    speed: number
    skill: number
    morale: number
    id: string
    name: string
    class: string
    image: string
    breedCount: number
    auction?: auction
    genes: string
    parts: AxieParts[]
}

export interface AxiesOficialData {
    data: {
        axies: {
            results: [{
                id: string
                name: string
                class: string
                image: string
                breedCount: number
                genes: string,
                stats: {
                    hp: number
                    speed: number
                    skill: number
                    morale: number
                }
                parts: [{
                    id: string
                    name: string
                    type: string
                    class: string
                }],
                auction?:auction
            }]
        }
    }
}

export interface AxiesResultsOficialData {
    id: string
    name: string
    class: string
    image: string
    breedCount: number
    auction?: auction
    stats: stats
    genes: string
    parts: AxieParts[]
}

export interface stats{
    hp: number
    speed: number
    skill: number
    morale: number
}

export interface AxieParts{
    id: string
    name: string
    type: string
    class: string
}

export interface auction {
    startingPrice?: any
    endingPrice?: any
    startingTimestamp?: any
    endingTimestamp?: any
    duration?: any
    timeLeft?: any
    currentPriceUSD: string
    currentPrice: string
    suggestedPrice?: any
    seller?: any
    listingIndex?: any
    state?: any
}
export interface communityRequest { from: string, communityId: string, id: string, fromName: string }
export interface community {
    type: string;
    name: string;
    id: string;
    members?: any[];
    admin?: string;
    rankType: string;
    discord?: string;
    feed?: any[];
    rank?: any;
    solicitudes?: any[];
}
export interface communityPost {
    author: any;
    text: string;
    creationDate: Date;
    communityId: string;
}
export interface userLink {
    uid: string;
    roninAddress: string;
    avatar: string;
    userAvatar?: Axie;
}

export interface community {
    type: string;
    name: string;
    id: string;
    members?: any[];
    admin?: string;
    rankType: string;
    discord?: string;
    feed?: any[];
    rank?: any;
    solicitudes?: any[];
}

export interface MarcketPlaceOficialData {
    data: {
        axies: {
            results: [{
                auction: auction
            }]
        }
    }
}

export interface MarketPlacePrice {
    price: string
    eth: string
}

export interface Portafolio {
    usd: number
    eth: number
    axies: number
    becados: number
    na: number
    typeAxies: number[]
}

export interface GraphqlBody{
    operationName: string,
    variables: {
        from: number,
        size: number,
        sort: string,
        auctionType: string,
        owner?: string,
        criteria?: Criteria
    },
    query: string
}

export interface Criteria{
    parts: string[],
    breedCount: number[],
    hp: number[],
    speed: number[],
    skill: number[],
    morale: number[],
    classes: string[],
    pureness: number[]
}

export interface contentpdf{
    totalbecados: number
    totalPortafolio: number
    totalAxie: number
    totalPortafolioEth: number
    totalNa: number
    totalEgg: number
    axiesTypes: axiestypesPdf[]
}

export interface axiestypesPdf{
    type: string,
    totalType: number
    totalUsd: number,
    averageValue: number,
    maxValue: number,
    minValue: number,
    tototalEth: number
}

export interface PriceCryto{
    slp: number
    etherium: number
    axs: number
}

export interface PriceGoingeko{
    usd: number
}
export interface Genes{
    d: {
        class: string,
        type: string,
        partName: string,
    }
    r1: {
        class: string,
        type: string,
        partName: string,
    }
    r2: {
        class: string,
        type: string,
        partName: string,
    }
}

export interface Perfiles{
    name: string
    axies: string[],
    slp: string,
    axs: string, 
    weth: string
}
export interface RandomMessaje{
    data: {
        createRandomMessage: string
    }
}
export interface AccessToken{
    data: {
        createAccessTokenWithSignature:{
            accessToken: string,
            newAccount: boolean,
            result: boolean,
            __typename: string
        }
    }
}

export interface ResAccesToken{
    blockchain_related: {
        signature:{
            amount: number,
            signature: string,
            timestamp: number
        }
    }
}
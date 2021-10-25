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
    name: string
    price?: string
    eth?: string
    axie: {
        name: string
        class: string
        image: string
        breedCount: number
    }
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
    }]
}

export interface AxiesParseData {
    axies: {
        name: string
        class: string
        image: string
        breedCount: number
    }
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
    }]
}

export interface AxiesOficialData {
    data: {
        axies: {
            results: [{
                name: string
                class: string
                image: string
                breedCount: number
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
                }]
            }]
        }
    }
}

export interface AxiesResultsOficialData {
    name: string
    class: string
    image: string
    breedCount: number
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
    }]
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

export interface MarcketPlaceOficialData{
    data: {
        axies: {
            results: [{
                auction: {
                    currentPriceUSD: string
                    currentPrice: string
                }
            }]
        }
    }
}

export interface MarketPlacePrice{
    price: string
    eth: string
}

export interface Portafolio{
    totalUsd: number
    totalEth: number
    totalAxies: number
    totalBecados: number
    na: number 
    totalTypeAxies: number[]
}
export interface scholarOfficialData{
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
}

export interface ParseUserData{
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
    subTitleNumber:  number,
    usd?: number,
    nombre?: string,
    mmr?: number
}

export interface DatosFormulario{
    id?: number,
    name: string,
    apellido?: string,
    roninAddress: string,
    personalAdress?: string,
    ganancia?: string
}

export interface HistoricData{
    labelSlp: number[]
    dataset: Dataset[]
}

export interface Dataset{
    label: string,
    data: number[], 
    borderColor: string,
    fill: boolean,
    backgroundColor: string, 
    borderWidth: number 
}
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

export interface statsData{
    client_id:string,
    win_total: number,
    draw_total: number,
    lose_total: number,
    elo: number,
    rank: number,
    name: string
}

export interface earningsData {
    address: string,
    slp_holdings: number,
    slp_inventory: number,
    slp_in_total: number,
    last_claimed: number,
    next_claim: string,
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
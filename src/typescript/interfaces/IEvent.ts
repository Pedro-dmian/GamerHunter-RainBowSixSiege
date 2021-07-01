export interface IEvent {
    cat_type_category_challenge: number
    value: any
    overwolf_game_id: number
    cat_game_id: number
    Sync: number
    completChallenge: boolean
    challenge_id: number
}

export interface ISomeData {
    name: string
    data: any
}

export interface IShouldHighlightEvent {
    eventShort?: IEvent,
    shouldHighlight: boolean
}
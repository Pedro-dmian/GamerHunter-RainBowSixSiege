
export interface IGameChallenge {
    id: number
    name: string
    description: string
    api_url: string
    api_key: string
    points_win: number
    points_defeat: number
    points_match: number
    points_minute: number
    points_experience: number
    url_image: string
    active: number
    icon_url: string
    deleted_at: Date
    created_at: Date
    updated_at: Date
    img_help: string
    notes_game: string
    game_web: number
    game_wolf: number
    exist: boolean
    name_user: string
    points_user: number
    name_button: string
    modal: string
    brackground: string
    box_game: string
    icon: string
    user_id: number
    api_brackground: string
    api_box_game: string
    api_icon: string
    challenges?: IChallenge
    overwolf_game_id?: number
}

export interface IChallenge {
    data_challenge_1?: IDataChallenge
    data_challenge_2?: IDataChallenge
    error: boolean
    msg: string
}

export interface IDataChallenge {
    info_challenge: {
        id: number
        user_id: number
        cat_challenge_game_id: number
        is_started: number
        is_finished: number
        goal: number
        user_goal: number
        active: number
        datetime_finished: Date
        datetime_synchronization: Date
        deleted_at: Date
        created_at: Date
        updated_at: Date
        count_clic: number
        goal_current: number
        position_challenge: number
        cat_game_id: number
        coupon_id: number
        percentage_goal: number
        cat_challenge_game: {
            id: number
            cat_game_id: number
            name: string
            description: string
            goal: number
            points_win: number
            img_url: string
            active: number
            deleted_at: Date
            created_at: Date
            updated_at: Date
            cat_type_category_challenge_id: number
            challenge_boost: number
            initial_date: Date
            expiration_date: Date
            cat_type_category_challenge: {
                id: number
                name: string
                description: string
                active: number
                deleted_at: Date
                created_at: Date
                updated_at: Date
                image_url: string
                cat_game_id: number
                api_image_url: string
            }
        }
    },
    error: boolean
    msg: string
}

export interface ILinkAccount {
    username: string
    game_id: number
}
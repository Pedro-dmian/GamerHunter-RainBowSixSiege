export interface IGame {
    active: number
    api_key: string
    api_url: string
    box_game: string
    brackground: string
    created_at: Date
    deleted_at: Date
    description: string
    exist: boolean
    game_web: number
    game_wolf: number
    icon: string
    icon_url: string
    id: number
    img_help: string
    modal: string
    name: string
    name_button: string
    name_user: string
    notes_game: string
    points_defeat: number
    points_experience: number
    points_match: number
    points_minute: number
    points_user: number
    points_win: number
    updated_at: Date
    url_image: string
    user_id: number
}

export interface ICategorieGameExtends {
    categories: {
        active: number
        cat_game_id: number
        created_at: Date
        deleted_at: Date
        description: string
        id: number
        image_url: string
        name: string
        updated_at: Date
    }[]
}

export interface ICategorieGame extends ICategorieGameExtends {
    description: string
    id: number
    name: string
}

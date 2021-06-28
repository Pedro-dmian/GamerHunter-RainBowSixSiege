export interface ICoupon {
    active: number
    archives: IArchive[]
    coupons_reclaimed: number
    created_at: Date
    date_since: Date
    date_since_format: string
    date_until: Date
    description: string
    hunter_coins: number
    id: number
    image_url: string
    name: string
    name_store: string
    percentage_discount: string
    quantity: number
    updated_at: Date
    url_store: string
    user_id: number
}

export interface IArchive {
    active: number
    created_at: Date
    deleted_at: Date
    file_url: string
    filesize: string
    id: number
    label: string
    name: string
    pivot: any
    size: number
    type: string
    updated_at: Date
    updated_user: number
    user_id: number
}
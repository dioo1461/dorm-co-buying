type Gender = 'man' | 'woman'

export interface AddProfileRequestBody {
    name: string
    gender: Gender
    description: string
    birth: string // birth format : 'YYYY-MM-DD'
    age?: number
    email?: string
}

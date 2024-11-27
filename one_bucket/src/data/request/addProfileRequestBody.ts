type Gender = 'man' | 'woman'

export interface AddProfileRequestBody {
    name: string
    gender: Gender
    age: number
    description: string
    email: string
    birth: string // birth format : 'YYYY-MM-DD'
}

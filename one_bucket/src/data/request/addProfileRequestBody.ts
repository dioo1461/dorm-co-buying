export interface AddProfileRequestBody {
    name: string
    gender: string
    age: number
    description: string
    // birth format : 'YYYY-MM-DD'
    birth: string
}

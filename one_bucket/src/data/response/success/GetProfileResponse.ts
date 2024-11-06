type Gender = 'man' | 'woman'

export const Gender: { [key in Gender]: string } = {
    man: '남성',
    woman: '여성',
}

export interface GetProfileResponse {
    name: string
    gender: Gender
    description: string | null
    birth: string
    createAt: string
    updateAt: string
}

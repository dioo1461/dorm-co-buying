export interface PhoneRequestBody {
    phonenumber: string
}

export interface SchoolAuthRequestBody {
    university: string
    universityEmail: string
}

export interface CodeValRequestBody {
    university: string
    universityEmail: string
    verifiedCode: string
}

export interface SignUpRequestBody {
    username: string
    password: string
    nickname: string
}

export interface NewPwRequestBody {
    username: string
    email: string
}

export interface ChangePwRequestBody {
    oldPassword: string
    newPassword: string
}

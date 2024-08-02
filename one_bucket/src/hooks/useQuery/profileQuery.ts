import { getMemberInfo } from '@/apis/profileService'
import { GetMemberInfoResponse } from '@/data/response/getMemberInfoResponse'
import { useQuery } from 'react-query'

export const queryGetMemberInfo = (token: string) => {
    return useQuery<GetMemberInfoResponse>(['memberInfo', token], getMemberInfo)
}

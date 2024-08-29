import { GetBoardPostResponse } from '@/data/response/GetBoardPostResponse'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'

export type RootStackParamList = {
    SignUp: undefined
    SignUp2: {
        phoneNumber: string
    }
    SignUp3: undefined
    SignUp4: {
        schoolEmail: string
    }
    SignUp5: undefined
    SignUp6: undefined
    SignUp7: undefined

    BoardPost: {
        postData: GetBoardPostResponse
    }
    CreateBoardPost: undefined
    ProfileDetails: undefined
    PostGroupPurchase: undefined
}

type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>

export const stackNavigation = useNavigation<RootStackNavigationProp>

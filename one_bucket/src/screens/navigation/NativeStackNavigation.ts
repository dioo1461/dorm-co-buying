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

    Board: {
        pendingRefresh: boolean
    }
    BoardPost: {
        boardId: number
        postId: number
    }
    BoardCreatePost: {
        boardName: string
        boardId: number
    }

    Search: undefined

    Notification: undefined

    AlertSetting: undefined
    Announcement: undefined
    Support: undefined

    ChatList: undefined
    Chat: {
        roomId: string
    }

    ProfileDetails: undefined
    PostGroupPurchase: undefined

    ImageEnlargement: {
        imageUriList: string[]
        index: number
    }
}

type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>

export const stackNavigation = useNavigation<RootStackNavigationProp>

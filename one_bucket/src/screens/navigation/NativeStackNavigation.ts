import { ChatRoom } from '@/data/response/success/chat/GetChatRoomListResponse'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'

export type RootStackParamList = {
    /*
    SignUp: undefined
    SignUp2: {
        phoneNumber: string
    }
    SignUp3: undefined
    SignUp4: {
        schoolName: string
        schoolEmail: string
    } */
    SignUp5: undefined
    SignUp6: undefined
    SignUp7: undefined
    NewPw: undefined
    NewPw2: {
        email: string
    }

    UnauthHome: undefined

    Market: {
        pendingRefresh: boolean
    }
    MarketPost: {
        postId: number
    }
    CreateMarketPost: undefined
    Board: {
        pendingRefresh: boolean
    }
    BoardPost: {
        boardName: string
        boardId: number
        postId: number
        performRefresh: boolean
    }
    CreateBoardPost: {
        boardName: string
        boardId: number
    }
    UpdateBoardPost: {
        boardId: number
        postId: number
        title: string
        content: string
        imageUrlList: string[]
    }

    Search: undefined
    Notification: undefined
    Setting: undefined

    SchoolAuth1: undefined
    SchoolAuth2: {
        schoolName: string
        schoolEmail: string
    }
    SchoolAuth3: undefined
    ChangePw: undefined
    ChangePw2: undefined

    AlertSetting: undefined
    AnnouncementList: any
    AnnouncementPost: {
        title: string
        content: string
        id: number
    }
    Support: undefined
    VersionCheck: undefined

    ChatList: undefined
    Chat: ChatRoom

    ProfileDetails: undefined

    ImageEnlargement: {
        imageUriList: string[]
        index: number
        isLocalUri: boolean
    }
}

type RootStackNavigationProp = NavigationProp<RootStackParamList>

export const stackNavigation = useNavigation<RootStackNavigationProp>

import { ChatRoom } from '@/data/response/success/chat/GetChatRoomListResponse'
import { GetGroupTradePostResponse } from '@/data/response/success/groupTrade/GetGroupTradePostResponse'
import { GetUsedTradePostResponse } from '@/data/response/success/usedTrade/GetUsedTradePostResponse'
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
    SignUp6: { accessToken: string }
    SignUp7: { accessToken: string }
    NewPw: undefined
    NewPw2: {
        email: string
    }

    UnauthHome: undefined

    GroupTrade: {
        pendingRefresh: boolean
    }
    GroupTradePost: {
        postId: number
    }
    CreateGroupTradePost: undefined
    UpdateGroupTradePost: GetGroupTradePostResponse

    UsedTrade: {
        pendingRefresh: boolean
    }
    UsedTradePost: {
        postId: number
    }
    CreateUsedTradePost: undefined
    UpdateUsedTradePost: GetUsedTradePostResponse

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
        res: any
    }
    Support: undefined
    VersionCheck: undefined

    ChatList: undefined
    Chat: ChatRoom

    ProfileDetails: undefined
    MyBoardPosts: undefined
    MyGroupTradePosts: undefined
    MyUsedTradePosts: undefined
    MyLikedPosts: undefined
    JoinedGroupTradePosts: undefined

    ImageEnlargement: {
        imageUriList: string[]
        index: number
        isLocalUri: boolean
    }

    GroupTradeSearch: {
        keyword: string
        option: number
    }

    UsedTradeSearch: {
        keyword: string
        option: number
    }

    BoardPostSearch: {
        boardId: number
        boardName: string
        keyword: string
        option: number
    }
}

export type SearchTabParamList = {}

type RootStackNavigationProp = NavigationProp<RootStackParamList>

export const stackNavigation = useNavigation<RootStackNavigationProp>

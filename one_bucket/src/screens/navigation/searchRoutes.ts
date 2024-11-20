import strings from '@/constants/strings'
import Board from '@/screens/home/board/Board'
import Home from '@/screens/home/Home'
import GroupTrade from '@/screens/home/groupTrade/GroupTrade'

export const homeRoutes = [
    {
        name: strings.homeScreenName,
        title: strings.homeScreenTitle,
        component: Home,
    },
    {
        name: strings.groupTradeScreenName,
        title: strings.groupTradeScreenTitle,
        component: GroupTrade,
    },
    {
        name: strings.tradeScreenName,
        title: strings.tradeScreenTitle,
        component: GroupTrade,
    },
    {
        name: strings.boardScreenName,
        title: strings.boardScreenTitle,
        component: Board,
    },
]

import strings from '@/constants/strings'
import Board from '@/screens/home/board/Board'
import Home from '@/screens/home/Home'
import GroupTrade from '@/screens/home/groupTrade/GroupTrade'
import UsedTrade from '../home/usedTrade/UsedTrade'

export const homeRoutes = [
    /*
    {
        name: strings.homeScreenName,
        title: strings.homeScreenTitle,
        component: Home,
    }, */
    {
        name: strings.groupTradeScreenName,
        title: strings.groupTradeScreenTitle,
        component: GroupTrade,
    },
    {
        name: strings.usedTradeScreenName,
        title: strings.usedTradeScreenTitle,
        component: UsedTrade,
    },
    {
        name: strings.boardScreenName,
        title: strings.boardScreenTitle,
        component: Board,
    },
]

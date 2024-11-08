import strings from '@/constants/strings'
import Board from '@/screens/home/board/Board'
import Home from '@/screens/home/Home'
import Market from '@/screens/home/market/Market'

export const homeRoutes = [
    {
        name: strings.homeScreenName,
        title: strings.homeScreenTitle,
        component: Home,
    },
    {
        name: strings.marketScreenName,
        title: strings.marketScreenTitle,
        component: Market,
    },
    {
        name: strings.tradeScreenName,
        title: strings.tradeScreenTitle,
        component: Market,
    },
    {
        name: strings.boardScreenName,
        title: strings.boardScreenTitle,
        component: Board,
    },
]

import { darkColors, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import React, { useEffect } from 'react'
import { Appearance } from 'react-native'
import HomeTab from './HomeTab'
import strings from '@/constants/strings'
import Home from '../home/Home'
import Board from '../home/Board'
import GroupPurchase from '../home/GroupPurchase'

export const homeRoutes = [
    {
        name: strings.homeScreenName,
        title: strings.homeScreenTitle,
        component: Home,
    },
    {
        name: strings.groupPurchaseScreenName,
        title: strings.groupPurchaseScreenTitle,
        component: GroupPurchase,
    },
    {
        name: strings.tradeScreenName,
        title: strings.tradeScreenTitle,
        component: GroupPurchase,
    },
    {
        name: strings.boardScreenName,
        title: strings.boardScreenTitle,
        component: Board,
    },
]

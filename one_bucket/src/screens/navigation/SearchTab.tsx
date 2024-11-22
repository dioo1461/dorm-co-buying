import { baseColors, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useEffect } from 'react'
import { View } from 'react-native'
import { useQueryClient } from 'react-query'
import GroupTradeSearch from '../search/GroupTradeSearch'
import BoardPostSearch from '../search/BoardPostSearch'

interface Props {
    keyword: string
    option: number
}

const Tab = createMaterialTopTabNavigator()
const SearchTab: React.FC<Props> = ({ keyword, option }): JSX.Element => {
    const { themeColor, boardList } = useBoundStore(state => ({
        themeColor: state.themeColor,
        boardList: state.boardList,
    }))

    const queryClient = useQueryClient()

    useEffect(() => {
        return () => {
            queryClient.removeQueries('searchGroupTradePosts')
        }
    }, [])

    const calculateWidth = (name: string) => {
        const baseWidth = 50 // 최소 너비
        const charWidth = 10 // 문자당 추가 너비
        return baseWidth + name.length * charWidth
    }

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarIndicatorStyle: {
                    backgroundColor: baseColors.GRAY_2,
                },
                tabBarItemStyle: {
                    width: 'auto',
                    marginHorizontal: 10,
                },
                tabBarStyle: {
                    backgroundColor:
                        themeColor === lightColors
                            ? baseColors.WHITE
                            : baseColors.DARK_BG,
                },
                tabBarLabelStyle: {
                    color: themeColor.TEXT,
                    fontFamily: 'NanumGothic',
                    fontSize: 12,
                },
                swipeEnabled: false,
            }}>
            <Tab.Screen
                name='공동구매'
                component={GroupTradeSearch}
                initialParams={{ keyword: keyword, option: option }}
            />
            <Tab.Screen
                name='중고거래'
                component={View}
                initialParams={{ keyword: keyword, option: option }}
            />
            {boardList.map(board => {
                if (board.type !== 'post') return null
                return (
                    <Tab.Screen
                        key={board.id}
                        name={board.name}
                        component={BoardPostSearch}
                        initialParams={{
                            boardId: board.id,
                            boardName: board.name,
                            keyword: keyword,
                            option: option,
                        }}
                    />
                )
            })}
        </Tab.Navigator>
    )
}

export default SearchTab

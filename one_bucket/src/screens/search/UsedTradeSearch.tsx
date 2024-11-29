import UsedTradePostComponent from '@/components/usedTrade/UsedTradePostComponent'
import Loading from '@/components/Loading'
import { UsedTradePostReduced } from '@/data/response/success/usedTrade/GetUsedTradePostListResponse'
import { querySearchUsedTradePosts } from '@/hooks/useQuery/usedTradeQuery'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import {
    Animated,
    ListRenderItem,
    RefreshControl,
    Text,
    View,
} from 'react-native'
import { RootStackParamList } from '../navigation/NativeStackNavigation'
import { useQueryClient } from 'react-query'

const FETCH_SIZE = 10

const UsedTradeSearch: React.FC = (): JSX.Element => {
    const { themeColor, boardList } = useBoundStore(state => ({
        themeColor: state.themeColor,
        boardList: state.boardList,
    }))

    const { params } =
        useRoute<RouteProp<RootStackParamList, 'UsedTradeSearch'>>()

    const returnOption = (option: number) => {
        if (option == 0) return 'titleAndContent'
        if (option == 1) return 'title'
        if (option == 2) return 'content'
        else return 'titleAndContent'
    }

    const PostFlatList: React.FC = (): JSX.Element => {
        const [isRefreshing, setIsRefreshing] = useState(false)

        const handleRefresh = async () => {
            setIsRefreshing(true)
            await refetch()
            setIsRefreshing(false)
        }

        // ### 게시글 목록 flatlist ###
        const renderItem: ListRenderItem<UsedTradePostReduced> = ({ item }) => (
            <UsedTradePostComponent data={item} />
        )

        const boardId = boardList
            ? boardList.find(board => board.type === 'usedTradePost')?.id
            : undefined

        const {
            data,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            isLoading,
            isSuccess,
            error,
            refetch,
        } = querySearchUsedTradePosts(
            boardId!,
            params.keyword,
            returnOption(params.option),
            {
                sortType: 'createdDate',
                sort: 'desc',
            },
            FETCH_SIZE,
            { enabled: !!boardId },
        )

        if (error) return <Text>Error...</Text>

        if (isLoading)
            return <Loading style={{ marginTop: 260 }} theme={themeColor} />

        const posts = data?.pages?.flatMap(page => page.content)
        return (
            <View>
                {isSuccess && posts!.length > 0 ? (
                    <Animated.FlatList
                        style={{ paddingTop: 20 }}
                        data={posts}
                        renderItem={renderItem}
                        refreshControl={
                            <RefreshControl
                                progressViewOffset={40}
                                refreshing={isRefreshing}
                                onRefresh={handleRefresh}
                            />
                        }
                        showsVerticalScrollIndicator={true}
                        keyExtractor={item => item.postId.toString()}
                        onEndReached={() => {
                            if (!isFetchingNextPage && hasNextPage)
                                fetchNextPage()
                        }}
                        onEndReachedThreshold={0.5} // 스크롤이 50% 남았을 때 데이터 요청
                        ListFooterComponent={<View style={{ height: 40 }} />} // 마지막 Post가 잘려 보이는 문제 임시 조치
                    />
                ) : (
                    <Text
                        style={{
                            color: themeColor.TEXT_SECONDARY,
                            fontSize: 13,
                            fontFamily: 'NanumGothic',
                            textAlign: 'center',
                            marginTop: 260,
                        }}>
                        검색 결과가 없습니다.
                    </Text>
                )}
            </View>
        )
    }

    return (
        <View>
            <PostFlatList />
        </View>
    )
}

export default UsedTradeSearch

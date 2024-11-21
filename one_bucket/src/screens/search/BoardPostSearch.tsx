import GroupTradePostComponent from '@/components/groupTrade/GroupTradePostComponent'
import Loading from '@/components/Loading'
import { GroupTradePostReduced } from '@/data/response/success/groupTrade/GetGroupTradePostListResponse'
import { querySearchGroupTradePosts } from '@/hooks/useQuery/groupTradeQuery'
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
import { querySearchBoardPosts } from '@/hooks/useQuery/boardQuery'
import PostComponent from '@/components/board/PostComponent'
import { BoardPostReduced } from '@/data/response/success/board/GetBoardPostListResponse'

const FETCH_SIZE = 10

const BoardPostSearch: React.FC = (): JSX.Element => {
    const { themeColor, boardList } = useBoundStore(state => ({
        themeColor: state.themeColor,
        boardList: state.boardList,
    }))

    const { params } =
        useRoute<RouteProp<RootStackParamList, 'BoardPostSearch'>>()

    const PostFlatList: React.FC = (): JSX.Element => {
        const [isRefreshing, setIsRefreshing] = useState(false)

        const handleRefresh = async () => {
            setIsRefreshing(true)
            await refetch()
            setIsRefreshing(false)
        }

        // ### 게시글 목록 flatlist ###
        const renderItem: ListRenderItem<BoardPostReduced> = ({ item }) => (
            <PostComponent data={item} />
        )

        const {
            data,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            isLoading,
            error,
            refetch,
        } = querySearchBoardPosts(
            params.boardId,
            params.keyword,
            'titleAndContent',
            {
                sortType: 'createdDate',
                sort: 'desc',
            },
            FETCH_SIZE,
            { enabled: !!params.boardId },
        )

        if (error) return <Text>Error...</Text>

        if (isLoading)
            return <Loading style={{ marginTop: 260 }} theme={themeColor} />

        const posts = data?.pages?.flatMap(page => page.content)
        return (
            <Animated.FlatList
                style={{ paddingTop: 20 }}
                data={isLoading ? [] : posts}
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
                    if (!isFetchingNextPage && hasNextPage) fetchNextPage()
                }}
                onEndReachedThreshold={0.5} // 스크롤이 50% 남았을 때 데이터 요청
                ListFooterComponent={<View style={{ height: 40 }} />} // 마지막 Post가 잘려 보이는 문제 임시 조치
            />
        )
    }

    return (
        <View>
            <PostFlatList />
        </View>
    )
}

export default BoardPostSearch

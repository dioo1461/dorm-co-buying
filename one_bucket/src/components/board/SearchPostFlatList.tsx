import Loading from '@/components/Loading'
import { baseColors, Icolor } from '@/constants/colors'
import { BoardPostReduced } from '@/data/response/success/board/GetBoardPostListResponse'
import { queryBoardPostList } from '@/hooks/useQuery/boardQuery'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    ListRenderItem,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import PostComponent from './PostComponent'

const FETCH_SIZE = 10

interface PostFlatListProps {
    boardId: number | null
    themeColor: Icolor
    boardName: string
    onRefreshCallback?: () => void
}

const SearchPostFlatList: React.FC<PostFlatListProps> = ({
    boardId,
    themeColor,
    boardName,
    onRefreshCallback,
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false)

    const styles = createStyles(themeColor)

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await refetch()
        setIsRefreshing(false)
        onRefreshCallback && onRefreshCallback() // 외부 콜백 호출
    }

    // 게시글 렌더링 함수
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
    } = queryBoardPostList(
        boardId!,
        {
            sortType: 'createdDate',
            sort: 'desc',
        },
        FETCH_SIZE,
        { enabled: !!boardId },
    )

    if (error) return <Text>Error...</Text>
    if (isLoading) return <Loading theme={themeColor} />

    const posts = data?.pages?.flatMap(page => page.content)
    return (
        <View style={styles.flatList}>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
                ListHeaderComponent={() => (
                    <View style={styles.boardTypeContainer}>
                        <Text style={styles.boardTypeLabel}>{boardName}</Text>
                    </View>
                )}
                showsVerticalScrollIndicator={true}
                data={posts}
                renderItem={renderItem}
                keyExtractor={item => item.postId.toString()}
                onEndReached={() => {
                    if (!isFetchingNextPage && hasNextPage) fetchNextPage()
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ActivityIndicator style={{ marginVertical: 20 }} />
                    ) : null
                }
            />
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        flatList: {
            flex: 1,
        },
        boardTypeContainer: {
            marginTop: 4,
            padding: 20,
        },
        boardTypeLabel: {
            fontSize: 16,
            fontFamily: 'NanumGothic-Bold',
            color: theme.TEXT,
        },
        postContainer: {
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: baseColors.GRAY_3,
        },
        postTitle: {
            fontSize: 14,
            fontFamily: 'NanumGothic-Bold',
            color: theme.TEXT,
        },
        postContentText: {
            fontSize: 13,
            fontFamily: 'NanumGothic',
            color: theme.TEXT,
            lineHeight: 18,
            marginTop: 8,
        },
        postImage: {
            width: 72,
            height: 72,
            borderRadius: 8,
            marginTop: 10,
        },
    })

export default SearchPostFlatList

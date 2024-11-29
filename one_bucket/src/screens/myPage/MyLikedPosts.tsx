import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcComment from '@/assets/drawable/ic-comment.svg'
import IcLikes from '@/assets/drawable/ic-thumb-up.svg'
import { CachedImage } from '@/components/CachedImage'
import Loading from '@/components/Loading'
import { baseColors, Icolor, lightColors } from '@/constants/colors'
import strings from '@/constants/strings'
import { BoardPostReduced } from '@/data/response/success/board/GetBoardPostListResponse'
import { queryMyLikedPostList } from '@/hooks/useQuery/boardQuery'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import {
    RootStackParamList,
    stackNavigation,
} from '@/screens/navigation/NativeStackNavigation'
import { formatTimeAgo } from '@/utils/formatUtils'
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native'
import { useLayoutEffect, useRef, useState } from 'react'
import {
    Animated,
    FlatList,
    ListRenderItem,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native'

const FETCH_SIZE = 10

// TODO: 사진 올리기
// TODO: type-Post 인 게시판만 보여주도록 수정
const MyLikedPosts: React.FC = (): JSX.Element => {
    const { themeColor, boardList, getBoardNameById } = useBoundStore(
        state => ({
            themeColor: state.themeColor,
            boardList: state.boardList,
            getBoardNameById: state.getBoardNameById,
        }),
    )

    const styles = createStyles(themeColor)
    const navigation = stackNavigation()
    type BoardRouteProp = RouteProp<RootStackParamList, 'Board'>
    const { params } = useRoute<BoardRouteProp>()

    const flatlistRef = useRef(null)
    var refetchCallback: () => void

    useLayoutEffect(() => {
        navigation.setOptions({
            title: strings.myLikedPostsScreenTitle,
            headerStyle: {
                backgroundColor: themeColor.HEADER_BG,
            },
            headerTitleStyle: {
                color: themeColor.HEADER_TEXT,
                fontFamily: 'NanumGothic',
                fontSize: 18,
            },
            headerLeft: () => (
                <TouchableOpacity
                    style={{ marginLeft: 16 }}
                    onPress={() => navigation.goBack()}>
                    <IcAngleLeft fill={themeColor.HEADER_TEXT} />
                </TouchableOpacity>
            ),
        })
    }, [navigation, themeColor])

    useFocusEffect(() => {
        if (!!refetchCallback && params?.pendingRefresh) {
            refetchCallback()
            navigation.setParams({ pendingRefresh: false })
        }
    })

    const [currentBoardIndex, setCurrentBoardIndex] = useState(0)

    const touchableNativeFeedbackBg = () => {
        return TouchableNativeFeedback.Ripple(
            themeColor === lightColors ? baseColors.GRAY_3 : baseColors.GRAY_1,
            false,
        )
    }

    const Post = (data: BoardPostReduced) => {
        return (
            <View>
                <TouchableNativeFeedback
                    background={touchableNativeFeedbackBg()}
                    onPress={() => {
                        if (data.boardId == 1 || data.boardId == 2) {
                            navigation.navigate('BoardPost', {
                                boardName: boardList[currentBoardIndex].name,
                                boardId: data.boardId,
                                postId: data.postId,
                                performRefresh: false,
                            })
                        } else if (data?.boardId == 3) {
                            navigation.navigate('GroupTradePost', {
                                postId: data.postId,
                            })
                        } else if (data?.boardId == 4) {
                            navigation.navigate('UsedTradePost', {
                                postId: data.postId,
                            })
                        } else {
                            // 예외 처리 또는 기본 동작 (필요 시 추가)
                            return null
                        }
                    }}>
                    <View
                        style={{
                            marginHorizontal: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                        }}>
                        <View style={{ flexDirection: 'row', margin: 4 }}>
                            <View style={{ flex: 1, marginEnd: 10 }}>
                                {/* ### 게시판 종류 ### */}
                                <Text style={styles.postBoardName}>
                                    {getBoardNameById(data.boardId)}
                                </Text>
                                {/* ### 제목 ### */}
                                <View
                                    style={{
                                        // marginTop: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text
                                        style={styles.postTitle}
                                        ellipsizeMode='tail'
                                        numberOfLines={1}>
                                        {data.title}
                                    </Text>
                                </View>
                                {/* ### 내용 ### */}
                                <View
                                    style={{
                                        marginTop: 16,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text
                                        numberOfLines={2}
                                        ellipsizeMode='tail'
                                        style={styles.postContentText}>
                                        {data.text}
                                    </Text>
                                </View>
                            </View>
                            {/* ### 이미지 ### */}
                            {data.imageUrls.length > 0 ? (
                                <View style={styles.postImage}>
                                    <CachedImage
                                        imageStyle={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: 8,
                                        }}
                                        imageUrl={data.imageUrls[0]}
                                    />
                                </View>
                            ) : (
                                <></>
                            )}
                        </View>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 6,
                            }}>
                            {/* ### 생성일자, 조회수 ### */}
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={styles.postMetaDataText}>
                                    {`${formatTimeAgo(
                                        data.createdDate,
                                    )}ㆍ조회 ${data.views}`}
                                </Text>
                            </View>
                            {/* ### 추천수, 댓글 ### */}
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'flex-end',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <IcLikes />
                                <Text
                                    style={[
                                        styles.postlikeCountText,
                                        { marginStart: 1, marginEnd: 6 },
                                    ]}>
                                    {data.likes}
                                </Text>
                                <IcComment />
                                <Text
                                    style={[
                                        styles.postCommentCountText,
                                        { marginStart: 2 },
                                    ]}>
                                    {data.commentsCount ?? 0}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <View style={styles.line} />
            </View>
        )
    }

    const PostFlatList: React.FC = (): JSX.Element => {
        const [isRefreshing, setIsRefreshing] = useState(false)

        const handleRefresh = async () => {
            setIsRefreshing(true)
            await refetch()
            setIsRefreshing(false)
        }

        // ### 게시글 목록 flatlist ###
        const renderItem: ListRenderItem<BoardPostReduced> = ({ item }) => (
            <Post {...item} />
        )

        const boardId = boardList ? boardList[currentBoardIndex]?.id : null

        const {
            data, // 각 페이지의 데이터를 담고 있음
            fetchNextPage, // 다음 페이지 불러오기 함수
            hasNextPage, // 다음 페이지가 있는지 여부
            isFetchingNextPage, // 다음 페이지 불러오는 중인지 여부
            isLoading, // 첫 번째 페이지 로딩 여부
            error,
            refetch,
        } = queryMyLikedPostList(
            {
                sortType: 'createdDate',
                sort: 'desc',
            },
            FETCH_SIZE,
        )

        refetchCallback = refetch

        if (error) return <Text>Error...</Text>

        if (isLoading) return <Loading theme={themeColor} />

        const posts = data?.pages?.flatMap(page => page.content)

        return (
            <FlatList
                style={styles.flatList}
                showsVerticalScrollIndicator={true}
                ref={flatlistRef}
                data={posts}
                renderItem={renderItem}
                keyExtractor={item => item.postId.toString()}
                onEndReached={() => {
                    if (!isFetchingNextPage && hasNextPage) fetchNextPage()
                }}
                onEndReachedThreshold={0.5} // 스크롤이 50% 남았을 때 데이터 요청
                // ListFooterComponent={
                //     isFetchingNextPage ? (
                //         <ActivityIndicator size='small' color='#0000ff' />
                //     ) : null
                // }
            />
        )
    }

    const animation = useRef(new Animated.Value(0)).current

    return (
        <View style={styles.container}>
            {/* ### 게시글 목록 flatlist ### */}
            <PostFlatList />
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: { flex: 1 },
        flatList: {
            paddingTop: 10,
            flex: 11,
        },
        boardTypeContainer: {
            marginTop: 4,
            padding: 20,
        },
        boardTypeLabel: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic-Bold',
        },
        boardTypeToggleButton: {
            position: 'absolute',
            top: 14,
            right: 14,
            padding: 6,
            borderRadius: 10,
            zIndex: 2,
            backgroundColor:
                theme === lightColors ? baseColors.WHITE : baseColors.GRAY_2,
        },
        boardTypeSelectionWrapper: {
            position: 'absolute',
            top: 60,
            right: 14,
            width: 160,
            borderRadius: 10,
            backgroundColor:
                theme === lightColors ? baseColors.WHITE : baseColors.GRAY_2,
            elevation: 4,
            zIndex: 2,
        },
        boardTypeSelectionContainer: {
            maxHeight: 200,
        },
        boardTypeSelectionContent: {
            paddingVertical: 5,
        },
        boardTypeItem: {
            paddingVertical: 12,
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        boardTypeText: {
            fontSize: 14,
            color: theme === lightColors ? theme.TEXT_SECONDARY : theme.TEXT,
            fontFamily: 'NanumGothic',
        },
        boardTypeTextActive: {
            color: baseColors.SCHOOL_BG,
            fontFamily: 'NanumGothic-Bold',
        },
        postContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 10,
            paddingStart: 6,
        },
        postImage: {
            width: 72,
            height: 72,
            borderRadius: 10,
        },
        postContentContainer: {
            flex: 6,
            marginStart: 24,
            marginEnd: 10,
            marginTop: 6,
            flexDirection: 'row',
        },
        line: {
            borderBottomWidth: 1,
            borderBottomColor:
                theme === lightColors ? baseColors.GRAY_3 : baseColors.GRAY_1,
            marginHorizontal: 10,
        },
        postBoardName: {
            color: theme.TEXT_SECONDARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
            marginBottom: 10,
        },
        postTitle: {
            color: theme.TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic-Bold',
        },
        postContentText: {
            color: theme.TEXT,
            fontSize: 13,
            fontFamily: 'NanumGothic',
            lineHeight: 18,
        },
        postMetaDataText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
        postlikeCountText: {
            color: baseColors.LIGHT_RED,
            fontSize: 12,
            fontFamily: 'NanumGothic-Bold',
        },
        postCommentCountText: {
            color: baseColors.LIGHT_BLUE,
            fontSize: 12,
            fontFamily: 'NanumGothic-Bold',
        },
        fab: {
            backgroundColor: theme.BUTTON_BG,
            position: 'absolute',
            width: 56,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            right: 25,
            bottom: 70,
            borderRadius: 30,
            elevation: 8,
        },
        fabIcon: {
            fontSize: 40,
            color: theme.BUTTON_TEXT,
        },
    })

export default MyLikedPosts

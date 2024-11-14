import IcComment from '@/assets/drawable/ic-comment.svg'
import IcPinList from '@/assets/drawable/ic-pin-list.svg'
import IcLikes from '@/assets/drawable/ic-thumb-up.svg'
import Backdrop from '@/components/Backdrop'
import { CachedImage } from '@/components/CachedImage'
import Loading from '@/components/Loading'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { BoardPostReduced } from '@/data/response/success/board/GetBoardPostListResponse'
import { queryBoardPostList } from '@/hooks/useQuery/boardQuery'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { formatTimeAgo } from '@/utils/formatUtils'
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native'
import { useEffect, useRef, useState } from 'react'
import {
    Animated,
    Appearance,
    FlatList,
    ListRenderItem,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native'
import {
    RootStackParamList,
    stackNavigation,
} from '../../navigation/NativeStackNavigation'

const FETCH_SIZE = 10

// TODO: 사진 올리기
// TODO: type-Post 인 게시판만 보여주도록 수정
const Board: React.FC = (): JSX.Element => {
    const { themeColor, setThemeColor, boardList } = useBoundStore(state => ({
        themeColor: state.themeColor,
        setThemeColor: state.setThemeColor,
        boardList: state.boardList,
    }))

    // 다크모드 변경 감지
    useEffect(() => {
        const themeSubscription = Appearance.addChangeListener(
            ({ colorScheme }) => {
                setThemeColor(colorScheme === 'dark' ? darkColors : lightColors)
            },
        )
        return () => themeSubscription.remove()
    }, [])

    const styles = createStyles(themeColor)
    const navigation = stackNavigation()
    type BoardRouteProp = RouteProp<RootStackParamList, 'Board'>
    const { params } = useRoute<BoardRouteProp>()

    const flatlistRef = useRef(null)
    var refetchCallback: () => void

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
        // const truncateText = (event: LayoutChangeEvent) => {
        //     const { height } = event.nativeEvent.layout
        // }
        return (
            <View>
                <TouchableNativeFeedback
                    background={touchableNativeFeedbackBg()}
                    onPress={() =>
                        navigation.navigate('BoardPost', {
                            boardName: boardList[currentBoardIndex].name,
                            boardId: data.boardId,
                            postId: data.postId,
                            performRefresh: false,
                        })
                    }>
                    <View
                        style={{
                            marginHorizontal: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                        }}>
                        <View style={{ flexDirection: 'row', margin: 4 }}>
                            <View style={{ flex: 1, marginEnd: 10 }}>
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

        // ### 게시판 타입 헤더 ###
        const FlatlistHeader = () => {
            return (
                <View>
                    <View style={styles.boardTypeContainer}>
                        <Text style={styles.boardTypeLabel}>
                            {boardList[currentBoardIndex]?.name}
                        </Text>
                    </View>
                    <View style={styles.line} />
                </View>
            )
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
        } = queryBoardPostList(
            boardId!,
            {
                sortType: 'createdDate',
                sort: 'desc',
            },
            FETCH_SIZE,
            { enabled: !!boardId },
        )
        refetchCallback = refetch

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
                    ListHeaderComponent={FlatlistHeader}
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
            </View>
        )
    }

    const [expanded, setExpanded] = useState(false)
    const animation = useRef(new Animated.Value(0)).current

    const toggleDropdown = () => {
        setExpanded(!expanded)
        Animated.timing(animation, {
            toValue: expanded ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start()
    }

    const dropdownAnimatedStyle = {
        height: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 200],
        }),
        opacity: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        }),
    }

    const buttonAnimatedStyle = {
        opacity: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
        }),
    }

    return (
        <View style={styles.container}>
            {/* ### 게시글 목록 flatlist ### */}
            <PostFlatList />
            <Backdrop enabled={expanded} onPress={toggleDropdown} />
            {/* ### 게시판 선택 버튼 ### */}
            <View
                style={[
                    styles.boardTypeToggleButton,
                    { backgroundColor: baseColors.SCHOOL_BG, elevation: 6 },
                ]}>
                <TouchableOpacity onPress={toggleDropdown}>
                    <IcPinList fill={baseColors.WHITE} />
                </TouchableOpacity>
            </View>
            <Animated.View
                style={[styles.boardTypeToggleButton, buttonAnimatedStyle]}>
                <TouchableOpacity onPress={toggleDropdown}>
                    <IcPinList
                        fill={
                            themeColor === lightColors
                                ? baseColors.GRAY_2
                                : baseColors.GRAY_0
                        }
                    />
                </TouchableOpacity>
            </Animated.View>
            {/* ### 게시판 선택 dropdown ### */}
            <Animated.View
                style={[
                    styles.boardTypeSelectionWrapper,
                    dropdownAnimatedStyle,
                ]}>
                <ScrollView
                    style={styles.boardTypeSelectionContainer}
                    contentContainerStyle={styles.boardTypeSelectionContent}
                    showsVerticalScrollIndicator={false}>
                    {boardList!.map(
                        (board, index) =>
                            board.type === 'post' && (
                                <TouchableNativeFeedback
                                    key={index}
                                    background={touchableNativeFeedbackBg()}
                                    onPress={() => {
                                        toggleDropdown()
                                        setCurrentBoardIndex(index)
                                    }}>
                                    <View style={styles.boardTypeItem}>
                                        <Text
                                            style={[
                                                styles.boardTypeText,
                                                currentBoardIndex === index &&
                                                    styles.boardTypeTextActive,
                                            ]}>
                                            {board.name}
                                        </Text>
                                    </View>
                                </TouchableNativeFeedback>
                            ),
                    )}
                </ScrollView>
            </Animated.View>
            <TouchableOpacity
                style={styles.fab}
                onPress={() =>
                    // TODO: 게시판 선택에 따라 파라미터 다르게 넘겨주는 로직 구현
                    navigation.navigate('CreateBoardPost', {
                        boardName: boardList![currentBoardIndex].name,
                        boardId: boardList![currentBoardIndex].id,
                        // refetch: refetchCallback,
                    })
                }>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: { flex: 1 },
        flatList: {
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

export default Board
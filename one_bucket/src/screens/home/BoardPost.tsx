import IcComment from '@/assets/drawable/ic-comment.svg'
import IcThumbUp from '@/assets/drawable/ic-thumb-up.svg'
import IcOthers from '@/assets/drawable/ic-others.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { queryBoardPost } from '@/hooks/useQuery/boardQuery'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Animated,
    Appearance,
    GestureResponderEvent,
    LayoutChangeEvent,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import {
    RootStackParamList,
    stackNavigation,
} from '../navigation/NativeStackNavigation'
import IcSend from '@/assets/drawable/ic-send.svg'
import {
    GetBoardPostResponse,
    IComment,
} from '@/data/response/success/board/GetBoardPostResponse'
import { addComment, addLike, deleteLike } from '@/apis/boardService'
import LoadingBackdrop from '@/components/LoadingBackdrop'
import { CachedImage } from '@/components/CachedImage'
import { sleep } from '@/utils/asyncUtils'

const IMAGE_SIZE = 112
// 좋아요 요청을 보낼 수 있는 시간 간격 (ms)
const LOCK_SLEEP_TIME = 3000

// TODO: 게시글 수정 기능 구현
// TODO: 게시글 삭제 기능 구현
// TODO: 댓글 수정 기능 구현
// TODO: 댓글 삭제 기능 구현
// TODO: 게시글 및 댓글 신고 기능 구현
// TODO: 본인 글에 좋아요 못하게 설정
//      -> authorNickname 외에도 authorUsername이 추가로 필요함
const BoardPost: React.FC = (): JSX.Element => {
    const { themeColor, setThemeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
        setThemeColor: state.setThemeColor,
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

    type BoardPostProp = RouteProp<RootStackParamList, 'BoardPost'>
    const { params } = useRoute<BoardPostProp>()

    const navigation = stackNavigation()

    // 레이아웃 관련 변수
    const [isImageInView, setImageInView] = useState(false)
    const scrollViewRef = useRef<ScrollView>(null)
    const imageScrollViewRef = useRef<ScrollView>(null)
    const [imageScrollPos, setImageScrollPos] = useState(0)
    const [commentPosition, setCommentPosition] = useState(0)

    // 상태 관리 변수
    const userLiked = useRef<boolean>(true)
    const likeLock = useRef<boolean>(false)
    const [likeAdded, setLikeAdded] = useState(0)

    const [commentValue, setCommentValue] = useState('')
    const [parentCommentId, setParentCommentId] = useState(-1)

    const [isRefreshing, setIsRefreshing] = useState(false)
    const [backdropEnabled, setBackdropEnabled] = useState(false)

    const onSuccessCallback = (data: GetBoardPostResponse) => {
        userLiked.current = data.userAlreadyLikes
        setLikeAdded(0)
    }

    const { data, isLoading, error, refetch } = queryBoardPost(
        params.postId,
        onSuccessCallback,
    )

    const animationList: Animated.Value[] = []

    // TODO: 댓글 내용 validate
    const handleCommentSubmit = async () => {
        setBackdropEnabled(true)
        var requestBody
        if (parentCommentId !== -1) {
            requestBody = {
                postId: params.postId,
                text: commentValue,
                parentCommentId: parentCommentId,
            }
        } else {
            requestBody = {
                postId: params.postId,
                text: commentValue,
            }
        }

        addComment(requestBody)
            .then(res => {
                setCommentValue('')
                refetch()
                setBackdropEnabled(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await refetch()
        setIsRefreshing(false)
    }

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const threshold = 0
        const scrollY = event.nativeEvent.contentOffset.y
        const windowHeight = event.nativeEvent.layoutMeasurement.height
        const contentHeight = event.nativeEvent.contentSize.height

        // console.log(`scrollY: ${scrollY}, windowHeight: ${windowHeight}`)
        // 스크롤 위치가 댓글 영역에 근접하면 이미지 컨테이너를 본문 내로 이동
        if (
            scrollY + windowHeight >= commentPosition + threshold ||
            contentHeight <= windowHeight
        ) {
            if (isImageInView) setImageInView(false)
        } else {
            if (!isImageInView) setImageInView(true)
        }

        // 이미지 스크롤뷰의 스크롤 상태를 동기화
        if (imageScrollViewRef.current) {
            imageScrollViewRef.current.scrollTo({
                y: scrollY,
                animated: false,
            })
        }
    }

    const handleCommentLayout = (event: LayoutChangeEvent) => {
        // 댓글 영역의 Y 위치 저장
        setCommentPosition(event.nativeEvent.layout.y)
    }

    const onMomentumScrollEnd = (
        event: NativeSyntheticEvent<NativeScrollEvent>,
    ) => {
        const position = event.nativeEvent.contentOffset.x
        setImageScrollPos(position)
    }

    const Comment: React.FC<{
        data: IComment
        isReply: boolean
        highlight: boolean
    }> = ({ data, isReply, highlight }): JSX.Element => {
        const animation = useRef(new Animated.Value(0)).current

        // TODO: 하이라이트 Fade-out 구현

        const replyAnimatedStyle = {
            opacity: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3],
            }),
        }

        useEffect(() => {
            Animated.timing(animation, {
                toValue: highlight ? 1 : 0,
                duration: 300,
                useNativeDriver: false,
            }).start()
        }, [])

        return (
            <View
                style={
                    !isReply
                        ? styles.commentContainer
                        : styles.replyCommentContainer
                }>
                <Animated.View
                    style={[styles.commentHighlight, replyAnimatedStyle]}
                />
                <View>
                    <View style={styles.commentHeader}>
                        {/* ### 프로필 이미지 ### */}
                        <View style={styles.commentProfileImage}></View>
                        {/* ### 닉네임 ### */}
                        <View style={styles.commentNicknameContainer}>
                            <Text style={styles.commentNicknameText}>
                                {data.authorNickname}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{ position: 'relative', top: -8 }}>
                            <IcOthers fill='white' />
                        </TouchableOpacity>
                    </View>
                    {/* ### 댓글 본문 ### */}
                    <View style={styles.commentBody}>
                        <Text style={styles.commentBodyText}>{data.text}</Text>
                    </View>
                    <View style={styles.commentFooter}>
                        <View style={styles.commentTime}>
                            <Text style={styles.commentTimeText}>
                                9/01 13:32
                            </Text>
                        </View>
                        <View style={styles.commentActions}>
                            {/* ### 좋아요 버튼 ###
                        <TouchableOpacity style={styles.commentActionButton}>
                            <IcThumbUp />
                            <Text
                                style={[
                                    styles.commentActionText,
                                    { color: baseColors.LIGHT_RED },
                                ]}>
                                2
                            </Text>
                        </TouchableOpacity> */}

                            {/* ### 답글 달기 버튼 ### */}
                            {!isReply && (
                                <TouchableOpacity
                                    style={styles.commentActionButton}
                                    onPress={() => {
                                        if (
                                            parentCommentId === data.commentId
                                        ) {
                                            setParentCommentId(-1)
                                        } else {
                                            setParentCommentId(data.commentId)
                                        }
                                    }}>
                                    <IcComment />
                                    <Text
                                        style={[
                                            styles.commentActionText,
                                            { color: baseColors.LIGHT_BLUE },
                                        ]}>
                                        답글 달기
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const handleLikeButtonPress = async () => {
        if (data!.authorNickname)
            if (likeLock.current) {
                // TODO: 좋아요 lock 알림 출력
                return
            }

        if (userLiked.current) {
            // TODO: 좋아요 취소 dialog 출력
            likeLock.current = true
            userLiked.current = false
            setLikeAdded(likeAdded - 1)
            await deleteLike(params.postId)
            await sleep(LOCK_SLEEP_TIME)
            likeLock.current = false
            return
        }

        if (!userLiked.current) {
            // TODO: 좋아요 완료 dialog 출력
            likeLock.current = true
            userLiked.current = true
            setLikeAdded(likeAdded + 1)
            await addLike(params.postId)
            await sleep(LOCK_SLEEP_TIME)
            likeLock.current = false
            return
        }
    }

    if (error) return <Text>Error...</Text>

    if (isLoading)
        return (
            <View
                style={{
                    backgroundColor: themeColor.BG,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <ActivityIndicator
                    size='large'
                    color={
                        themeColor === lightColors
                            ? baseColors.SCHOOL_BG
                            : baseColors.GRAY_2
                    }
                />
            </View>
        )

    const ImageScrollView = () => {
        return (
            <ScrollView
                ref={imageScrollViewRef}
                horizontal
                style={{ flexDirection: 'row' }}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onMomentumScrollEnd}
                contentOffset={{ x: imageScrollPos, y: 0 }}>
                {data!.imageUrls.map((url, index) => (
                    <View style={styles.imageContainer} key={index}>
                        <CachedImage
                            imageStyle={{
                                width: IMAGE_SIZE,
                                height: IMAGE_SIZE,
                            }}
                            imageUrl={url}
                        />
                    </View>
                ))}
            </ScrollView>
        )
    }

    return (
        <View style={styles.container}>
            {/* ### 본문 container ### */}
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
                style={{
                    flex: 1,
                    marginBottom: 60,
                    marginTop: 20,
                    marginHorizontal: 16,
                }}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                ref={scrollViewRef}
                scrollEventThrottle={0}>
                <Text
                    style={[
                        styles.titleText,
                        { marginHorizontal: 10, marginBottom: 10 },
                    ]}>
                    {data?.title}
                </Text>
                <Text
                    style={[
                        styles.contentText,
                        { marginHorizontal: 6, marginBottom: 10 },
                    ]}>
                    {data?.text}
                </Text>
                {/* 댓글이 보일 때 이미지 컨테이너가 본문 내로 이동 */}
                {!isImageInView && data!.imageUrls.length > 0 && (
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        style={{ flexDirection: 'row' }}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        contentOffset={{ x: imageScrollPos, y: 0 }}>
                        {data!.imageUrls.map((url, index) => (
                            <TouchableOpacity
                                style={styles.imageContainer}
                                key={index}
                                onPress={() =>
                                    navigation.navigate('ImageEnlargement', {
                                        imageUriList: data!.imageUrls,
                                        index: index,
                                        isLocalUri: false,
                                    })
                                }>
                                <CachedImage
                                    imageStyle={{
                                        width: IMAGE_SIZE,
                                        height: IMAGE_SIZE,
                                        borderRadius: 8,
                                    }}
                                    imageUrl={url}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
                {isImageInView && data!.imageUrls.length > 0 && (
                    <View style={{ height: IMAGE_SIZE }} />
                )}
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    {/* ### 좋아요 버튼 ### */}
                    <TouchableOpacity
                        style={styles.commentActionButton}
                        onPress={handleLikeButtonPress}>
                        <IcThumbUp />
                        <Text
                            style={[
                                styles.commentActionText,
                                { color: baseColors.LIGHT_RED },
                            ]}>
                            {data!.likes + likeAdded}
                        </Text>
                    </TouchableOpacity>
                    {/* ### 답글 달기 버튼 ### */}
                    <TouchableOpacity style={styles.commentActionButton}>
                        <IcComment />
                        <Text
                            style={[
                                styles.commentActionText,
                                { color: baseColors.LIGHT_BLUE },
                            ]}>
                            {data?.comments.length}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View onLayout={handleCommentLayout} style={styles.line} />
                {/* ### 댓글 리스트 ### */}
                <View>
                    {data?.comments.map((comment, index) => {
                        var highlight = comment.commentId === parentCommentId
                        return (
                            <View key={index}>
                                <Comment
                                    data={comment}
                                    isReply={false}
                                    highlight={highlight}
                                />
                                {comment.replies.map((val, idx) => (
                                    <Comment
                                        key={idx}
                                        data={val}
                                        isReply={true}
                                        highlight={false}
                                    />
                                ))}
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
            {/* ### 댓글 입력 container ### */}
            <View
                style={{
                    backgroundColor: themeColor.BG,
                    alignItems: 'center',
                    width: '100%',
                    height: 52,
                    position: 'absolute',
                    bottom: 0,
                }}>
                <View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.commentTextInput}
                        placeholder='댓글을 입력하세요.'
                        placeholderTextColor={themeColor.TEXT_SECONDARY}
                        value={commentValue}
                        onChangeText={text => setCommentValue(text)}
                    />
                    <TouchableOpacity
                        style={{ marginEnd: 10 }}
                        onPress={handleCommentSubmit}>
                        <IcSend
                            fill={
                                themeColor === lightColors
                                    ? baseColors.SCHOOL_BG
                                    : baseColors.GRAY_2
                            }
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {/* ### 이미지 container - 댓글 창이 보이지 않는 동안 하단에 고정 ### */}
            {isImageInView && data!.imageUrls.length > 0 && (
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    style={{
                        position: 'absolute',
                        bottom: 60, // 댓글 입력창 위에 위치
                        left: 0,
                        marginBottom: 20,
                        marginHorizontal: 20,
                    }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    contentOffset={{ x: imageScrollPos, y: 0 }}>
                    {data!.imageUrls.map((url, index) => (
                        <TouchableOpacity
                            style={styles.imageContainer}
                            key={index}
                            onPress={() =>
                                navigation.navigate('ImageEnlargement', {
                                    imageUriList: data!.imageUrls,
                                    index: index,
                                    isLocalUri: false,
                                })
                            }>
                            <CachedImage
                                imageStyle={{
                                    width: IMAGE_SIZE,
                                    height: IMAGE_SIZE,
                                    borderRadius: 8,
                                }}
                                imageUrl={url}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
            <LoadingBackdrop enabled={backdropEnabled} theme={themeColor} />
        </View>
    )
}

export default BoardPost

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: { flex: 1 },
        titleText: {
            color: theme.TEXT,
            fontSize: 20,
            fontFamily: 'NanumGothic-Bold',
        },
        contentText: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic',
        },
        imageContainer: {
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            marginRight: 8,
            borderRadius: 8,
        },
        commentContainer: {
            flex: 1,
            paddingVertical: 8,
        },
        replyCommentContainer: {
            flex: 1,
            marginStart: 20,
            paddingVertical: 8,
        },
        commentHighlight: {
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            backgroundColor: baseColors.SCHOOL_BG,
        },
        commentHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        commentProfileImage: {
            backgroundColor: 'white',
            width: 40,
            height: 40,
            margin: 6,
        },
        commentNicknameContainer: {
            flex: 1,
        },
        commentNicknameText: {
            color: theme.TEXT,
            fontSize: 16,
            marginStart: 10,
            fontFamily: 'NanumGothic',
        },
        commentBody: {
            flex: 1,
            paddingVertical: 6,
            paddingHorizontal: 10,
        },
        commentBodyText: {
            color: theme.TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
        commentFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        commentTime: {
            marginStart: 10,
        },
        commentTimeText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
        commentActions: {
            flexDirection: 'row',
        },
        commentActionButton: {
            // borderColor:
            //     theme === lightColors ? baseColors.GRAY_2 : baseColors.GRAY_2,
            // borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 4,
            paddingVertical: 4,
            marginStart: 6,
            borderRadius: 8,
        },
        commentActionText: {
            marginStart: 4,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
        line: {
            borderBottomWidth: 1,
            borderBottomColor:
                theme === theme ? baseColors.GRAY_3 : baseColors.GRAY_1,
            marginHorizontal: 10,
            paddingTop: 10,
            paddingBottom: 10,
            marginBottom: 10,
        },
        commentInputContainer: {
            backgroundColor: theme.BG_SECONDARY,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 4,
            marginHorizontal: 20,
            borderRadius: 40,
        },
        commentTextInput: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 14,
            flex: 1,
            marginStart: 6,
        },
    })

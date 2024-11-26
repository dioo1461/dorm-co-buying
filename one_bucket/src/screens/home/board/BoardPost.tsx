import {
    addComment,
    addLike,
    deleteLike,
    deletePost,
} from '@/apis/boardService'
import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcComment from '@/assets/drawable/ic-comment.svg'
import IcOthers from '@/assets/drawable/ic-others.svg'
import IcSend from '@/assets/drawable/ic-send.svg'
import IcThumbUp from '@/assets/drawable/ic-thumb-up.svg'
import { CachedImage } from '@/components/CachedImage'
import Loading from '@/components/Loading'
import Comment from '@/components/board/Comment'
import LoadingBackdrop from '@/components/LoadingBackdrop'
import {
    SelectableBottomSheet,
    SelectableBottomSheetButtonProps,
} from '@/components/bottomSheet/SelectableBottomSheet'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import {
    GetBoardPostResponse,
    IComment,
} from '@/data/response/success/board/GetBoardPostResponse'
import { queryBoardPost } from '@/hooks/useQuery/boardQuery'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { sleep } from '@/utils/asyncUtils'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
    Appearance,
    Keyboard,
    KeyboardAvoidingView,
    LayoutChangeEvent,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native'
import {
    RootStackParamList,
    stackNavigation,
} from '../../navigation/NativeStackNavigation'

const IMAGE_SIZE = 112
// 좋아요 요청을 보낼 수 있는 시간 간격 (ms)
const LOCK_SLEEP_TIME = 2000

// TODO: 댓글 수정 기능 구현
// TODO: 댓글 삭제 기능 구현
// TODO: 게시글 및 댓글 신고 기능 구현
const BoardPost: React.FC = (): JSX.Element => {
    const { themeColor, setThemeColor, memberInfo } = useBoundStore(state => ({
        themeColor: state.themeColor,
        setThemeColor: state.setThemeColor,
        memberInfo: state.memberInfo,
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
    useLayoutEffect(() => {
        navigation.setOptions({
            title: params.boardName,
            headerLeft: () => (
                <TouchableOpacity
                    style={{ marginLeft: 16 }}
                    onPress={() => navigation.goBack()}>
                    <IcAngleLeft fill={themeColor.HEADER_TEXT} />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 16 }}
                    onPress={() => setBottomSheetEnabled(true)}>
                    <IcOthers fill={themeColor.HEADER_TEXT} />
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: themeColor.HEADER_BG,
            },
            headerTitleStyle: {
                color: themeColor.HEADER_TEXT,
                fontFamily: 'NanumGothic',
                fontSize: 18,
            },
        })
    }, [navigation])

    // 레이아웃 관련 변수
    const [isImageInView, setImageInView] = useState(false)
    const scrollViewRef = useRef<ScrollView>(null)
    const commentInputRef = useRef<TextInput>(null)
    const imageScrollViewRef = useRef<ScrollView>(null)
    const [imageScrollPos, setImageScrollPos] = useState(0)
    const [commentPosition, setCommentPosition] = useState(0)

    const commentLayouts = useRef<{
        [key: string]: { yPos: number; height: number }
    }>({}) // 댓글 레이아웃 정보
    const contentHeight = useRef<number>(0)

    // 상태 관리 변수
    const userLiked = useRef<boolean>(true)
    const likeLock = useRef<boolean>(false)
    const [likeAdded, setLikeAdded] = useState(0)

    const [commentValue, setCommentValue] = useState('')
    const [parentCommentId, setParentCommentId] = useState(-1)
    const [editingCommentId, setEditingCommentId] = useState<number | null>(
        null,
    )

    const [isRefreshing, setIsRefreshing] = useState(false)
    const [loadingBackdropEnabled, setLoadingBackdropEnabled] = useState(false)

    const [bottomSheetEnabled, setBottomSheetEnabled] = useState(false)
    const [bottomSheetButtonProps, setBottomSheetButtonProps] = useState<any>(
        [],
    )

    const [commentBottomSheetEnabled, setCommentBottomSheetEnabled] =
        useState(false)
    const [commentBottomSheetButtonProps, setCommentBottomSheetButtonProps] =
        useState<SelectableBottomSheetButtonProps[]>([])

    useEffect(() => {
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                commentInputRef.current?.blur()
                setParentCommentId(-1)
            },
        )
        return () => {
            keyboardDidHideListener.remove()
        }
    }, [])

    const onSuccessCallback = (data: GetBoardPostResponse) => {
        userLiked.current = data.userAlreadyLikes
        const onModifyPostButtonPress = () => {
            navigation.navigate('UpdateBoardPost', {
                postId: params.postId,
                boardId: params.boardId,
                title: data!.title,
                content: data!.text,
                imageUrlList: data!.imageUrls,
            })
        }
        const onDeletePostButtonPress = () => {
            deletePost(params.postId).then(() => {
                navigation.navigate('Board', { pendingRefresh: true })
            })
        }
        const onReportPostButtonPress = () => {}

        setLikeAdded(0)
        if (data.authorNickname == memberInfo!.nickname) {
            setBottomSheetButtonProps([
                {
                    text: '수정하기',
                    style: 'default',
                    onPress: onModifyPostButtonPress,
                },
                {
                    text: '삭제하기',
                    style: 'destructive',
                    onPress: onDeletePostButtonPress,
                },
            ])
        } else {
            setBottomSheetButtonProps([
                {
                    text: '신고하기',
                    style: 'default',
                    onPress: onReportPostButtonPress,
                },
            ])
        }
    }

    const { data, isLoading, error, refetch } = queryBoardPost(
        params.postId,
        onSuccessCallback,
    )
    // TODO: 댓글 내용 validate
    const handleCommentSubmit = async () => {
        setLoadingBackdropEnabled(true)
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
                setLoadingBackdropEnabled(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const onCommentOptionButtonPress = (data: IComment) => {
        console.log(data)
        setCommentBottomSheetEnabled(true)
        setCommentBottomSheetButtonProps(
            data.authorNickname == memberInfo!.nickname
                ? [
                      {
                          text: '댓글 수정하기',
                          style: 'default',
                          onPress: () => {
                              setEditingCommentId(data.commentId)
                              setCommentBottomSheetEnabled(false)
                          },
                      },
                      {
                          text: '댓글 삭제하기',
                          style: 'destructive',
                          onPress: () => {},
                      },
                  ]
                : [
                      {
                          text: '댓글 신고하기',
                          style: 'default',
                          onPress: () => {},
                      },
                  ],
        )
    }

    const onLikeButtonPress = async () => {
        if (data!.authorNickname)
            if (likeLock.current) {
                ToastAndroid.show(
                    '좋아요는 2초에 한 번 이상 누를 수 없습니다.',
                    ToastAndroid.SHORT,
                )
                return
            }
        if (userLiked.current) {
            ToastAndroid.show('좋아요를 취소했습니다.', ToastAndroid.SHORT)
            likeLock.current = true
            userLiked.current = false
            setLikeAdded(likeAdded - 1)
            await deleteLike(params.postId)
            await sleep(LOCK_SLEEP_TIME)
            likeLock.current = false
            return
        }
        if (!userLiked.current) {
            // TODO: 좋아요 완료 toast 출력
            likeLock.current = true
            userLiked.current = true
            setLikeAdded(likeAdded + 1)
            await addLike(params.postId)
            await sleep(LOCK_SLEEP_TIME)
            likeLock.current = false
            return
        }
    }

    const onCommentEditComplete = (data: IComment) => {
        setEditingCommentId(null)
    }

    const countComments = (comments: IComment[]): number => {
        let count = 0
        comments.forEach(comment => {
            count += 1 + countComments(comment.replies)
        })
        return count
    }

    // ########## RENDERING PARTS ##########

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

    const onMomentumScrollEnd = (
        event: NativeSyntheticEvent<NativeScrollEvent>,
    ) => {
        const position = event.nativeEvent.contentOffset.x
        setImageScrollPos(position)
    }

    const likeButtonFill = (liked: boolean) => {
        if (liked) return baseColors.LIGHT_RED
        else return 'none'
    }

    const initContentHeight = (event: LayoutChangeEvent) => {
        // 본문의 Y 위치 저장
        contentHeight.current = event.nativeEvent.layout.height
    }

    const initCommentYpos = (commentId: number, event: LayoutChangeEvent) => {
        // 각 댓글의 Y 위치 저장
        const layout = event.nativeEvent.layout
        commentLayouts.current[commentId] = {
            yPos: layout.y,
            height: 0,
        }
    }

    const initCommentHeight = (commentId: number, event: LayoutChangeEvent) => {
        // 각 댓글의 Y 위치 저장
        const layout = event.nativeEvent.layout
        commentLayouts.current[commentId].height = layout.height
    }

    const scrollToComment = (commentId: number) => {
        const scrollView = scrollViewRef.current
        const commentPosition = commentLayouts.current[commentId].yPos
        const commentHeight = commentLayouts.current[commentId].height

        if (scrollView && commentPosition !== undefined) {
            // console.log('comment height:', commentHeight)
            // console.log('comment position:', commentPosition)
            // console.log('content height:', contentHeight.current)
            scrollView.scrollTo({
                y: contentHeight.current + commentPosition,
                animated: true,
            })
        }
    }

    if (error) return <Text>Error...</Text>
    if (isLoading) return <Loading theme={themeColor} />

    return (
        <View style={styles.container}>
            {/*
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
            {/* 작성자 프로필, 닉네임 */}
            <View style={styles.postHeader}>
                <View style={styles.authorProfileImage}></View>
                <Text style={{ ...styles.titleText, fontSize: 16 }}>
                    {data?.authorNickname}
                </Text>
            </View>
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
                    marginHorizontal: 16,
                }}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                ref={scrollViewRef}
                scrollEventThrottle={0}>
                {/* ###### 본문 ###### */}
                <View onLayout={e => initContentHeight(e)}>
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
                                        navigation.navigate(
                                            'ImageEnlargement',
                                            {
                                                imageUriList: data!.imageUrls,
                                                index: index,
                                                isLocalUri: false,
                                            },
                                        )
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
                        <View style={styles.likesAndCommentContainer}>
                            <IcThumbUp
                                fill={likeButtonFill(userLiked.current)}
                            />
                            <Text
                                style={[
                                    styles.likesAndCommentCountText,
                                    { color: baseColors.LIGHT_RED },
                                ]}>
                                {data!.likes + likeAdded}
                            </Text>
                        </View>
                        {/* ### 댓글 수 ### */}
                        <View style={styles.likesAndCommentContainer}>
                            <IcComment />
                            <Text
                                style={[
                                    styles.likesAndCommentCountText,
                                    { color: baseColors.LIGHT_BLUE },
                                ]}>
                                {
                                    countComments(data!.comments) // data!.commentsCount
                                }
                            </Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.likeButton}
                            onPress={() => onLikeButtonPress()}>
                            <IcThumbUp
                                fill={likeButtonFill(userLiked.current)}
                            />
                            <Text style={styles.likeButtonText}>좋아요</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <View onLayout={initCommentLayout} style={styles.line} /> */}
                {/* ### 댓글 리스트 ### */}
                <View>
                    {data?.comments.map((comment, index) => {
                        var highlight = comment.commentId === parentCommentId
                        return (
                            <View
                                key={index}
                                onLayout={e =>
                                    initCommentYpos(comment.commentId, e)
                                }>
                                <View
                                    onLayout={e =>
                                        initCommentHeight(comment.commentId, e)
                                    }>
                                    <Comment
                                        theme={themeColor}
                                        data={comment}
                                        isReply={false}
                                        parentCommentId={parentCommentId}
                                        setParentCommentId={id =>
                                            setParentCommentId(id)
                                        }
                                        isEditing={
                                            editingCommentId ===
                                            comment.commentId
                                        }
                                        highlight={highlight}
                                        onReplyButtonPress={() => {
                                            scrollToComment(comment.commentId)
                                            commentInputRef.current?.focus()
                                            console.log(
                                                comment.commentId,
                                                commentLayouts.current[
                                                    comment.commentId
                                                ],
                                            )
                                        }}
                                        onOptionButtonPress={data =>
                                            onCommentOptionButtonPress(data)
                                        }
                                    />
                                </View>
                                {comment.replies.map((replyComment, idx) => (
                                    <Comment
                                        key={idx}
                                        theme={themeColor}
                                        data={replyComment}
                                        isReply={true}
                                        parentCommentId={parentCommentId}
                                        setParentCommentId={id =>
                                            setParentCommentId(id)
                                        }
                                        isEditing={
                                            editingCommentId ===
                                            replyComment.commentId
                                        }
                                        highlight={false}
                                        onOptionButtonPress={data =>
                                            onCommentOptionButtonPress(data)
                                        }
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
                        ref={commentInputRef}
                        style={styles.commentTextInput}
                        placeholder='댓글을 입력하세요.'
                        placeholderTextColor={themeColor.TEXT_SECONDARY}
                        value={commentValue}
                        onChangeText={text => setCommentValue(text)}
                    />
                    <TouchableOpacity
                        style={{ marginEnd: 10 }}
                        onPress={() => {
                            if (!commentValue) {
                                ToastAndroid.showWithGravity(
                                    '내용을 입력해 주세요.',
                                    ToastAndroid.SHORT,
                                    ToastAndroid.CENTER,
                                )
                            } else handleCommentSubmit()
                        }}>
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
            <LoadingBackdrop
                enabled={loadingBackdropEnabled}
                theme={themeColor}
            />
            <SelectableBottomSheet
                theme={themeColor}
                onClose={() => setBottomSheetEnabled(false)}
                enabled={bottomSheetEnabled}
                buttons={bottomSheetButtonProps}
            />
            <SelectableBottomSheet
                theme={themeColor}
                onClose={() => setCommentBottomSheetEnabled(false)}
                enabled={commentBottomSheetEnabled}
                buttons={commentBottomSheetButtonProps}
            />
        </View>
    )
}

export default BoardPost

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: { flex: 1 },
        postHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 15,
            marginVertical: 10,
        },
        authorProfileImage: {
            backgroundColor: 'white',
            width: 40,
            height: 40,
            margin: 10,
        },
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
        likesAndCommentContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 4,
            paddingVertical: 4,
            marginStart: 6,
            borderRadius: 8,
        },
        likesAndCommentCountText: {
            marginStart: 4,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
        likeButton: {
            backgroundColor: theme.BG_SECONDARY,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
            marginVertical: 10,
            marginStart: 10,
            borderRadius: 8,
            width: 92,
        },
        likeButtonText: {
            color: theme.TEXT,
            fontSize: 12,
            fontFamily: 'NanumGothic',
            marginStart: 4,
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

import { addComment } from '@/apis/boardService'
import { joinTrade, quitTrade } from '@/apis/tradeService'
import {
    addLike,
    deleteLike,
    deleteUsedTradePost,
} from '@/apis/usedTradeService'
import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcHeart from '@/assets/drawable/ic-heart.svg'
import IcLocation from '@/assets/drawable/ic-location.svg'
import IcOthers from '@/assets/drawable/ic-others.svg'
import IcSend from '@/assets/drawable/ic-send.svg'
import { CachedImage } from '@/components/CachedImage'
import Loading from '@/components/Loading'
import Skeleton from '@/components/Skeleton'
import { baseColors, Icolor, lightColors } from '@/constants/colors'
import { GetUsedTradePostResponse } from '@/data/response/success/usedTrade/GetUsedTradePostResponse'
import { IComment } from '@/data/response/success/board/GetBoardPostResponse'
import { queryUsedTradePost } from '@/hooks/useQuery/usedTradeQuery'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { RouteProp, useRoute } from '@react-navigation/native'
import { OpenGraphParser } from '@sleiv/react-native-opengraph-parser'
import { useEffect, useRef, useState } from 'react'
import {
    SelectableBottomSheet,
    SelectableBottomSheetButtonProps,
} from '@/components/bottomSheet/SelectableBottomSheet'
import {
    Animated,
    Dimensions,
    LayoutChangeEvent,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native'
import { formatTimeAgo } from '@/utils/formatUtils'
import { sleep } from '@/utils/asyncUtils'
import {
    RootStackParamList,
    stackNavigation,
} from '../../navigation/NativeStackNavigation'
import Comment from '@/components/board/Comment'
import LoadingBackdrop from '@/components/LoadingBackdrop'

// link preview 보안 문제 ? (악의적 스크립트 삽입)

const [SCREEN_WIDTH, SCREEN_HEIGHT] = [
    Dimensions.get('window').width,
    Dimensions.get('window').height,
]

const LOCK_SLEEP_TIME = 2000

const UsedTradePost: React.FC = (): JSX.Element => {
    const { themeColor, memberInfo } = useBoundStore(state => ({
        themeColor: state.themeColor,
        memberInfo: state.memberInfo,
    }))

    const styles = createStyles(themeColor)
    const navigation = stackNavigation()

    type UsedTradePostRouteProp = RouteProp<RootStackParamList, 'UsedTradePost'>
    const { params } = useRoute<UsedTradePostRouteProp>()

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

    // 레이아웃 관련 변수
    const scrollY = useRef(new Animated.Value(0)).current

    // 상태 관리 변수
    const metaData = useRef<any>(null)
    const [isValidLink, setIsValidLink] = useState(true)
    const [_, forceRefresh] = useState({})
    const [time, setTime] = useState(5000)

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
        const timeout = setTimeout(() => {
            // 3초 후에도 metaData가 없으면 유효하지 않은 링크로 설정

            if (!metaData.current) {
                setIsValidLink(false)
                console.log('invalid link')
            } else [setIsValidLink(true), console.log('valid link')]
        }, time)

        return () => clearTimeout(timeout)
    }, [time])

    const onSuccessCallback = (data: GetUsedTradePostResponse) => {
        userLiked.current = data.userAlreadyLikes
        const parseMetaData = async (url: string) => {
            OpenGraphParser.extractMeta(url)
                .then(data => {
                    const hostname = data[0].url.split('/')[2]

                    const meta = {
                        title: data[0].title,
                        description: data[0].description,
                        url: hostname,
                        image: data[0].image,
                        'image:width': data[0]['image:width'],
                        'image:height': data[0]['image:height'],
                    }
                    metaData.current = meta
                    forceRefresh({})
                })
                .catch(error => {
                    metaData.current = null
                    console.log('error occurred while parsing url -' + error)
                })
        }

        if (data?.trade_linkUrl) {
            parseMetaData(data.trade_linkUrl)
        } else setTime(0)

        const onModifyPostButtonPress = () => {
            navigation.navigate('UpdateUsedTradePost', data)
        }
        const onDeletePostButtonPress = () => {
            deleteUsedTradePost(params.postId).then(() => {
                navigation.navigate('UsedTrade', { pendingRefresh: true })
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

    const { data, isLoading, error, refetch } = queryUsedTradePost(
        params.postId,
        onSuccessCallback,
    )
    useEffect(() => {
        console.log('queryUsedTradePost:', data)
    })

    const onJoinButtonPress = async () => {
        await joinTrade(data!.trade_id).then(() => {
            navigation.goBack()
        })
    }

    const onQuitButtonPress = async () => {
        await quitTrade(data!.trade_id).then(() => {
            navigation.goBack()
        })
    }

    const buttonText = (buttonMode: any) => {
        if (buttonMode == '0') return `참여하기`
        if (buttonMode == '1' || '2') return `참여 취소`
        if (buttonMode == '3') return `마감`
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

    const likeButtonFill = (liked: boolean) => {
        if (liked) return baseColors.LIGHT_RED
        else return 'none'
    }

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

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 300], // 스크롤 범위
        outputRange: [0, 1], // opacity 값 변화
        extrapolate: 'clamp', // 값이 범위를 벗어나지 않게 고정
    })

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false },
    )

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
            {/* ### 본문 ScrollView ### */}
            <Animated.ScrollView
                style={{ flex: 1, marginBottom: 72 }}
                onScroll={handleScroll}
                scrollEventThrottle={16}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled>
                    {data!.imageUrls?.map((url, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <CachedImage
                                imageStyle={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                imageUrl={url}
                            />
                        </View>
                    ))}
                </ScrollView>
                {/* ### 게시자 프로필 ### */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <View style={styles.profileContainer}>
                        {/* TODO: 프로필 사진 */}
                        <View style={styles.authorProfileImage}></View>
                        <Text style={styles.usernameText}>
                            {data?.authorNickname}
                        </Text>
                    </View>
                    {/* ### 좋아요 버튼 ### */}
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 20,
                        }}
                        onPress={() => onLikeButtonPress()}>
                        <Text style={styles.likesText}>
                            {data!.likes + likeAdded}
                        </Text>
                        <IcHeart fill={likeButtonFill(userLiked.current)} />
                    </TouchableOpacity>
                </View>
                {/* ### 본문 ### */}
                <View style={styles.bodyContainer}>
                    <Text style={styles.titleText}>{data?.title}</Text>
                    <Text style={styles.metadataText}>
                        {`${formatTimeAgo(data!.createdDate)}ㆍ${
                            data?.trade_tag
                        }`}
                    </Text>
                    <Text style={styles.contentText}>{data?.text}</Text>
                    {/* ### 사이트 링크 프리뷰 ### */}
                    {metaData.current ? (
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple(
                                baseColors.GRAY_2,
                                false,
                            )}>
                            <View style={styles.linkPreviewContainer}>
                                {/* ### 프리뷰 이미지 ### */}
                                <View
                                    style={{
                                        width: 112,
                                        height: 112,
                                    }}>
                                    <CachedImage
                                        imageUrl={metaData.current.image}
                                        imageStyle={{
                                            width: 112,
                                            height: 112,
                                        }}
                                        isExternalUrl={true}
                                    />
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        padding: 10,
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text style={styles.linkPreviewTitleText}>
                                        {metaData.current?.title}
                                    </Text>
                                    <Text style={styles.linkPreviewUrlText}>
                                        {metaData.current?.url}
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    ) : isValidLink ? (
                        <View style={styles.linkPreviewContainer}>
                            <Skeleton
                                containerStyle={{}}
                                theme={themeColor}
                                isLoading={true}
                                layout={[{ width: 112, height: 112 }]}
                            />
                            <Skeleton
                                containerStyle={{
                                    flex: 1,
                                    padding: 10,
                                    justifyContent: 'space-between',
                                }}
                                theme={themeColor}
                                isLoading={true}
                                layout={[
                                    { width: '100%', height: 60 },
                                    { width: '80%', height: 20 },
                                ]}
                            />
                        </View>
                    ) : (
                        <Text style={styles.invalidLinkText}>
                            {data?.trade_linkUrl}
                        </Text>
                    )}
                    {/* ### 거래 희망 장소 ### */}
                    <View>
                        <Text style={styles.locationLabel}>거래 희망 장소</Text>
                    </View>
                    {/* <View style={styles.locationMapContainer}></View> */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 10,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <IcLocation width={24} height={24} />
                            <Text style={styles.locationText}>
                                {data?.trade_location}
                            </Text>
                        </View>
                    </View>
                </View>
                {/* ### 댓글 ### */}
                <View style={{ marginHorizontal: 16 }}>
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
            </Animated.ScrollView>
            {/* ### 헤더 ### */}
            <Animated.View
                style={[
                    styles.headerBackground,
                    { backgroundColor: themeColor.BG, opacity: headerOpacity },
                ]}
            />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IcAngleLeft fill={'white'} style={{ elevation: 25 }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => setBottomSheetEnabled(true)}>
                        <IcOthers fill={'white'} style={{ elevation: 25 }} />
                    </TouchableOpacity>
                </View>
            </View>
            {/* ### 하단 바 ### */}
            <View style={styles.bottomBarContainer}></View>
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
            <LoadingBackdrop
                theme={themeColor}
                enabled={loadingBackdropEnabled}
            />
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: { flex: 1 },
        authorProfileImage: {
            backgroundColor: 'white',
            width: 40,
            height: 40,
            margin: 10,
        },
        imageContainer: {
            width: SCREEN_WIDTH,
            height: SCREEN_WIDTH,
            backgroundColor: 'gray',
        },
        profileContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 10,
        },
        usernameText: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic-Bold',
            fontSize: 16,
        },
        bodyContainer: {
            paddingHorizontal: 16,
        },
        titleText: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic-Bold',
            fontSize: 16,
            marginBottom: 6,
        },
        metadataText: {
            color: theme.TEXT_SECONDARY,
            fontFamily: 'NanumGothic',
            fontSize: 12,
            marginBottom: 16,
        },
        contentText: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 14,
            marginBottom: 20,
        },
        linkPreviewContainer: {
            backgroundColor:
                theme === lightColors ? baseColors.WHITE : baseColors.GRAY_1,
            flexDirection: 'row',
            width: '100%',
            height: 112,
            elevation: 3,
            marginBottom: 20,
        },
        linkPreviewTitleText: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 14,
        },
        linkPreviewUrlText: {
            color: theme.TEXT_SECONDARY,
            fontFamily: 'NanumGothic',
            fontSize: 12,
        },
        locationLabel: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic-Bold',
            fontSize: 14,
            paddingBottom: 10,
        },
        locationMapContainer: {
            backgroundColor: 'gray',
            width: '100%',
            height: 144,
            marginVertical: 10,
        },
        locationText: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 14,
        },
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'absolute',
            top: 0,
            width: '100%',
            padding: 16,
        },
        headerBackground: {
            position: 'absolute',
            top: 0,
            width: '100%',
            padding: 28,
        },
        bottomBarContainer: {
            backgroundColor: theme.BG_SECONDARY,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            padding: 16,
        },
        bottomBarLabel: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 14,
            marginVertical: 2,
        },
        bottomBarCountText: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic-Bold',
            fontSize: 14,
            textAlign: 'right',
            marginVertical: 2,
            marginHorizontal: 20,
        },
        bottomBarButtonText: {
            color: theme.BUTTON_TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 14,
        },
        likesText: {
            color: baseColors.LIGHT_RED,
            fontFamily: 'NanumGothic-Bold',
            fontSize: 14,
            paddingHorizontal: 10,
        },
        joinButton: {
            backgroundColor: theme.BUTTON_BG,
            padding: 10,
            borderRadius: 8,
        },
        invalidLinkText: {
            color: theme.TEXT_TERTIARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
            marginVertical: 10,
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

export default UsedTradePost
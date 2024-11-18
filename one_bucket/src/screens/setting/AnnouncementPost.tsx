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
import IcAttach from '@/assets/drawable/ic-attach-16.svg'
import { CachedImage } from '@/components/CachedImage'
import RNFS from 'react-native-fs'
import { BASE_URL, STORAGE_BASE_URL } from '@env'
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
    ActivityIndicator,
    Appearance,
    Dimensions,
    FlatList,
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
import { formatTimeAgo } from '@/utils/formatUtils'
import {
    RootStackParamList,
    stackNavigation,
} from '../navigation/NativeStackNavigation'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const IMAGE_SIZE = SCREEN_WIDTH * 0.9
// 좋아요 요청을 보낼 수 있는 시간 간격 (ms)
const LOCK_SLEEP_TIME = 2000

// TODO: 댓글 수정 기능 구현
// TODO: 댓글 삭제 기능 구현
// TODO: 게시글 및 댓글 신고 기능 구현
const AnnouncementPost: React.FC = (): JSX.Element => {
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

    type AnnouncementPostProp = RouteProp<RootStackParamList, 'AnnouncementPost'>
    const { params } = useRoute<AnnouncementPostProp>()

    useEffect(()=>{ console.log("AnnouncementPost params:",params) })

    const title = params?.res?.title
    const content = params?.res?.content
    const imageUrls = params?.res?.images
    const fileList = params?.res?.files

    const files = ({ item }: { item: any }) => (
        <TouchableOpacity 
            style={styles.fileContainer}
            
            >
            <IcAttach />
            <Text style={styles.fileText}>
                {item.slice(30,)}
            </Text>
        </TouchableOpacity>
    )

    const navigation = stackNavigation()

    // 레이아웃 관련 변수
    const [isImageInView, setImageInView] = useState(false)
    const scrollViewRef = useRef<ScrollView>(null)
    const commentInputRef = useRef<TextInput>(null)
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


    // ########## RENDERING PARTS ##########

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

    return (
        <View style={styles.container}>
        {/*
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
            {/* ### 본문 container ### */}
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
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
                    {title}
                </Text>
                <Text
                    style={[
                        styles.contentText,
                        { marginHorizontal: 6, marginBottom: 10 },
                    ]}>
                    {content}
                </Text>
                {/* 댓글이 보일 때 이미지 컨테이너가 본문 내로 이동 */}
                {!isImageInView && imageUrls.length > 0 && (
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        style={{ flexDirection: 'row' }}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        contentOffset={{ x: imageScrollPos, y: 0 }}>
                        {imageUrls.map((url: any, index: any) => (
                            <TouchableOpacity
                                style={styles.imageContainer}
                                key={index}
                                onPress={() =>
                                    navigation.navigate('ImageEnlargement', {
                                        imageUriList: imageUrls,
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
                                    imageUrl={url.slice(10,)}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
                {isImageInView && imageUrls.length > 0 && (
                    <View style={{ height: IMAGE_SIZE }} />
                )}
                <FlatList
                    data={fileList}
                    renderItem={files}
                    keyExtractor={(item, index) => index.toString()}
                />
                <Text style={styles.postMetaDataText}>
                    {`${formatTimeAgo(
                        params?.res?.createAt,
                    )}`}
                </Text>
            </ScrollView>
            <LoadingBackdrop
                enabled={loadingBackdropEnabled}
                theme={themeColor}
            />
            <SelectableBottomSheet
                theme={themeColor}
                onClose={() => setBottomSheetEnabled(!bottomSheetEnabled)}
                enabled={bottomSheetEnabled}
                buttons={bottomSheetButtonProps}
            />
            <SelectableBottomSheet
                theme={themeColor}
                onClose={() =>
                    setCommentBottomSheetEnabled(!commentBottomSheetEnabled)
                }
                enabled={commentBottomSheetEnabled}
                buttons={commentBottomSheetButtonProps}
            />
        </View>
    )
}

export default AnnouncementPost

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
        postMetaDataText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
            paddingTop: 20,
            paddingBottom: 20,
        },
        fileContainer: {
            flexDirection: 'row',
            backgroundColor: baseColors.GRAY_3,
            marginTop: 16,
            paddingTop: 8,
            paddingLeft: 8,
            paddingBottom: 8,
            borderRadius: 3,
        },
        fileText: {
            color: 'black',
            fontSize: 16,
            fontFamily: 'NanumGothic',
            paddingLeft: 8,
        }
    })

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
    Appearance,
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
import { IComment } from '@/data/response/success/board/GetBoardPostResponse'
import { addComment } from '@/apis/boardService'
import LoadingBackdrop from '@/components/LoadingBackdrop'
import { CachedImage } from '@/components/CachedImage'

const IMAGE_SIZE = 112

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

    const [commentValue, setCommentValue] = useState('')

    const [isImageInView, setImageInView] = useState(false)
    const scrollViewRef = useRef<ScrollView>(null)
    const imageScrollViewRef = useRef<ScrollView>(null)
    const [imageScrollPos, setImageScrollPos] = useState(0)
    const [commentPosition, setCommentPosition] = useState(0)

    const [isRefreshing, setIsRefreshing] = useState(false)
    const [backdropEnabled, setBackdropEnabled] = useState(false)

    const { data, isLoading, error, refetch } = queryBoardPost(params.postId)

    const handleCommentSubmit = async () => {
        setBackdropEnabled(true)
        addComment({ postId: params.postId, text: commentValue })
            .then(res => {
                console.log(res)
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

    const loadCheck = () => {}

    const Comment: React.FC<{ data: IComment }> = ({ data }): JSX.Element => {
        return (
            <View style={styles.commentContainer}>
                <View style={styles.commentHeader}>
                    {/* ### 프로필 이미지 ### */}
                    <View style={styles.commentProfileImage}></View>
                    {/* ### 닉네임 ### */}
                    <View style={styles.commentNicknameContainer}>
                        <Text style={styles.commentNicknameText}>
                            {data.authorNickname}
                        </Text>
                    </View>
                    <TouchableOpacity style={{ position: 'relative', top: -8 }}>
                        <IcOthers fill='white' />
                    </TouchableOpacity>
                </View>
                {/* ### 댓글 본문 ### */}
                <View style={styles.commentBody}>
                    <Text style={styles.commentBodyText}>{data.text}</Text>
                </View>
                <View style={styles.commentFooter}>
                    <View style={styles.commentTime}>
                        <Text style={styles.commentTimeText}>9/01 13:32</Text>
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
                        <TouchableOpacity style={styles.commentActionButton}>
                            <IcComment />
                            <Text
                                style={[
                                    styles.commentActionText,
                                    { color: baseColors.LIGHT_BLUE },
                                ]}>
                                답글 달기
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
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
                    <TouchableOpacity style={styles.commentActionButton}>
                        <IcThumbUp />
                        <Text
                            style={[
                                styles.commentActionText,
                                { color: baseColors.LIGHT_RED },
                            ]}>
                            {data?.likes}
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
                    {data?.comments.map((comment, index) => (
                        <Comment key={index} data={comment} />
                    ))}
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

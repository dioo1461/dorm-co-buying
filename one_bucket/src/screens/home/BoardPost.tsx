import IcComment from '@/assets/drawable/ic-comment.svg'
import IcThumbUp from '@/assets/drawable/ic-thumb-up.svg'
import IcOthers from '@/assets/mipmap/tab/ic-other.svg'
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
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { RootStackParamList } from '../navigation/NativeStackNavigation'

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

    const [imageUriList, setImageUriList] = useState<string[]>([])
    const [isImageInView, setImageInView] = useState(true)
    const scrollViewRef = useRef<ScrollView>(null)
    const imageScrollViewRef = useRef<ScrollView>(null)
    const [imageScrollPos, setImageScrollPos] = useState(0)
    const [commentPosition, setCommentPosition] = useState(0)

    const [expanded, setExpanded] = useState(false)

    const { data, isLoading, error } = queryBoardPost(params.postId)

    useEffect(() => {}, [])

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const threshold = 0
        const scrollY = event.nativeEvent.contentOffset.y
        const windowHeight = event.nativeEvent.layoutMeasurement.height

        // console.log(`scrollY: ${scrollY}, windowHeight: ${windowHeight}`)
        // 스크롤 위치가 댓글 영역에 근접하면 이미지 컨테이너를 본문 내로 이동
        if (scrollY + windowHeight >= commentPosition + threshold) {
            if (isImageInView) setImageInView(false)
        } else if (scrollY + windowHeight < commentPosition - threshold) {
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

    const Comment: React.FC = (data: any): JSX.Element => {
        return (
            <View style={styles.commentContainer}>
                <View style={styles.commentHeader}>
                    {/* ### 프로필 이미지 ### */}
                    <View style={styles.commentProfileImage}></View>
                    {/* ### 닉네임 ### */}
                    <View style={styles.commentNicknameContainer}>
                        <Text style={styles.commentNicknameText}>닉네임</Text>
                    </View>
                    <TouchableOpacity>
                        <IcOthers fill='white' />
                    </TouchableOpacity>
                </View>
                {/* ### 댓글 본문 ### */}
                <View style={styles.commentBody}>
                    <Text style={styles.commentBodyText}>댓글</Text>
                </View>
                <View style={styles.commentFooter}>
                    <View style={styles.commentTime}>
                        <Text style={styles.commentTimeText}>9/01 13:32</Text>
                    </View>
                    <View style={styles.commentActions}>
                        {/* ### 좋아요 버튼 ### */}
                        <TouchableOpacity style={styles.commentActionButton}>
                            <IcThumbUp />
                            <Text
                                style={[
                                    styles.commentActionText,
                                    { color: baseColors.LIGHT_RED },
                                ]}>
                                2
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
                                6
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

    return (
        <View style={styles.container}>
            {/* ### 본문 container ### */}
            <ScrollView
                style={{
                    flex: 1,
                    marginBottom: 60,
                    marginTop: 20,
                    marginHorizontal: 20,
                }}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                ref={scrollViewRef}
                scrollEventThrottle={0}>
                <Text style={[styles.titleText, { marginBottom: 10 }]}>
                    {data?.title}
                </Text>
                <Text style={styles.contentText}>{data?.text}</Text>
                {/* 댓글이 보일 때 이미지 컨테이너가 본문 내로 이동 */}
                {!isImageInView && imageUriList.length > 0 && (
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        style={{ flexDirection: 'row' }}
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        contentOffset={{ x: imageScrollPos, y: 0 }}>
                        {imageUriList.map((uri, index) => (
                            <View style={styles.imageContainer} key={index}>
                                <Text>이미지</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
                {isImageInView && imageUriList.length > 0 && (
                    <View style={{ height: IMAGE_SIZE }} />
                )}
                <View onLayout={handleCommentLayout} style={styles.line} />
                {/* ### 댓글 ### */}
                <View>
                    <Comment />
                    <Comment />
                    <Comment />
                    <Comment />
                    {/* <Text>{comment}</Text> */}
                </View>

                {/* ### 댓글 입력 container ### */}
                <View
                    style={{
                        width: '100%',
                        height: 60,
                        position: 'absolute',
                        backgroundColor: 'white',
                        bottom: 0,
                    }}>
                    <Text>댓글입력</Text>
                </View>
            </ScrollView>
            {/* ### 이미지 container - 댓글 창이 보이지 않는 동안 하단에 고정 ### */}
            {isImageInView && imageUriList.length > 0 && (
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
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    contentOffset={{ x: imageScrollPos, y: 0 }}>
                    {imageUriList.map((uri, index) => (
                        <TouchableOpacity
                            style={styles.imageContainer}
                            key={index}>
                            {/* <Image source={require(uri)} /> */}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    )
}

export default BoardPost

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: { flex: 1 },
        titleText: {
            color: theme.TEXT,
            fontSize: 18,
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
            backgroundColor: 'white',
            borderWidth: 1,
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
            color: theme.TEXT,
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
    })

import IcComment from '@/assets/drawable/ic-comment.svg'
import IcPinList from '@/assets/drawable/ic-pin-list.svg'
import IcLikes from '@/assets/drawable/ic-thumb-up.svg'
import Backdrop from '@/components/Backdrop'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { BoardPostReduced } from '@/data/response/success/board/GetBoardPostListResponse'
import { queryBoardPostList } from '@/hooks/useQuery/boardQuery'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Animated,
    Appearance,
    FlatList,
    ListRenderItem,
    ScrollView,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native'
import { stackNavigation } from '../navigation/NativeStackNavigation'

const Board: React.FC = (): JSX.Element => {
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
    const navigation = stackNavigation()

    const flatlistRef = useRef(null)

    const [boardId, setBoardId] = useState(1)

    const { data, isLoading, error } = queryBoardPostList(boardId, 0, {
        sortType: 'createdDate',
        sort: 'asc',
    })

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
                            boardId: data.boardId,
                            postId: data.postId,
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
                            {true ? (
                                <View
                                    style={[
                                        styles.postImage,
                                        {
                                            width: 72,
                                            height: 72,
                                            backgroundColor: 'white',
                                        },
                                    ]}
                                />
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
                                    {`${
                                        data.createdDate
                                    }ㆍ조회 ${'data.views'}`}
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
                                    {/* {data.likes} */}
                                </Text>
                                <IcComment />
                                <Text
                                    style={[
                                        styles.postCommentCountText,
                                        { marginStart: 2 },
                                    ]}>
                                    {/* {data.comments} */}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <View style={styles.line} />
            </View>
        )
    }

    const FlatlistHeader = () => {
        return (
            <View>
                <View style={styles.boardTypeContainer}>
                    <Text style={styles.boardTypeLabel}>
                        {boardTypes[currentBoardType]}
                    </Text>
                </View>
                <View style={styles.line} />
            </View>
        )
    }

    const renderItem: ListRenderItem<BoardPostReduced> = ({ item }) => (
        <Post {...item} />
    )

    const [currentBoardType, setCurrentBoardType] = useState(0)
    const boardTypes = [
        '전체게시판',
        '자유게시판',
        '비밀게시판',
        '헬스 및 운동',
        '취미 및 여가',
    ]

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
            {/* ### 게시글 목록 flatlist ### */}
            <View style={styles.flatList}>
                <FlatList
                    ListHeaderComponent={FlatlistHeader}
                    showsVerticalScrollIndicator={false}
                    ref={flatlistRef}
                    data={data?.content}
                    renderItem={renderItem}
                    keyExtractor={item => item.postId.toString()}
                />
            </View>
            <Backdrop expanded={expanded} onPress={toggleDropdown} />
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
                    {boardTypes.map((boardType, index) => (
                        <TouchableNativeFeedback
                            key={index}
                            background={touchableNativeFeedbackBg()}
                            onPress={() => {
                                setCurrentBoardType(index)
                                toggleDropdown()
                            }}>
                            <View style={styles.boardTypeItem}>
                                <Text
                                    style={[
                                        styles.boardTypeText,
                                        currentBoardType === index &&
                                            styles.boardTypeTextActive,
                                    ]}>
                                    {boardType}
                                </Text>
                            </View>
                        </TouchableNativeFeedback>
                    ))}
                </ScrollView>
            </Animated.View>
            <TouchableOpacity
                style={styles.fab}
                onPress={() =>
                    navigation.navigate('BoardCreatePost', {
                        boardName: '자유게시판',
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

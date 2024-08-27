import IcComment from '@/assets/drawable/ic-comment.svg'
import IcPinList from '@/assets/drawable/ic-pin-list.svg'
import IcLikes from '@/assets/drawable/ic-thumb-up.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { AppContext } from '@/hooks/useContext/AppContext'
import { useContext, useEffect, useRef, useState } from 'react'
import {
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

const enum Category {
    'none' = 0,
    'refridgerated' = 1,
    'frozen' = 2,
    'disposable' = 3,
    'others' = 4,
}

type ItemProps = {
    id: string
    title: string
    content: string
    views: number
    likes: number
    comments: number
    createdAt: string
    imageUri: string
}

const Board: React.FC = (): JSX.Element => {
    const { themeColor, setThemeColor } = useContext(AppContext)
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
    const flatlistRef = useRef(null)
    const flatlistData: ItemProps[] = [
        {
            id: '0',
            title: '젠장 또 대상혁이야',
            content:
                '제기랄, 또 대상혁이야. 이 글만 보고 자려고 했는데, 대상혁을 보고 말았어. 이제 나는 숭배해야만 해.... 숭배를 시작하면 잠이 확 깨 버릴 걸 알면서도, 나는 숭배해야만 해. 그것이 대상혁을 목도한 자의 사명이다. 자, 숭배를 시작하겠어.',
            views: 22,
            likes: 10,
            comments: 3,
            createdAt: 'createdAt0',
            imageUri: 'imageUri',
        },
        {
            id: '1',
            title: '젠장 또 대상혁이야',
            content:
                '제기랄, 또 대상혁이야. 이 글만 보고 자려고 했는데, 대상혁을 보고 말았어. 이제 나는 숭배해야만 해.... 숭배를 시작하면 잠이 확 깨 버릴 걸 알면서도, 나는 숭배해야만 해. 그것이 대상혁을 목도한 자의 사명이다. 자, 숭배를 시작하겠어.',
            views: 22,
            likes: 10,
            comments: 3,
            createdAt: 'createdAt0',
            imageUri: 'imageUri',
        },
        {
            id: '2',
            title: '젠장 또 대상혁이야',
            content:
                '제기랄, 또 대상혁이야. 이 글만 보고 자려고 했는데, 대상혁을 보고 말았어. 이제 나는 숭배해야만 해.... 숭배를 시작하면 잠이 확 깨 버릴 걸 알면서도, 나는 숭배해야만 해. 그것이 대상혁을 목도한 자의 사명이다. 자, 숭배를 시작하겠어.',
            views: 22,
            likes: 10,
            comments: 3,
            createdAt: 'createdAt0',
            imageUri: 'imageUri',
        },
    ]

    const [currentCategory, setCurrentCategory] = useState(Category.none)

    const touchableNativeFeedbackBg = () => {
        return TouchableNativeFeedback.Ripple(
            themeColor === lightColors ? baseColors.GRAY_3 : baseColors.GRAY_1,
            false,
        )
    }

    const Post = (data: ItemProps) => {
        // const truncateText = (event: LayoutChangeEvent) => {
        //     const { height } = event.nativeEvent.layout
        // }
        return (
            <View>
                <TouchableNativeFeedback
                    background={touchableNativeFeedbackBg()}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={styles.postContentContainer}>
                            <View>
                                <View
                                    style={{
                                        marginTop: 10,
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
                                <View
                                    style={{
                                        marginTop: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text
                                        numberOfLines={2}
                                        ellipsizeMode='tail'
                                        style={styles.postContent}>
                                        {data.content}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        marginTop: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text style={styles.postMetaData}>
                                        {`${data.createdAt}ㆍ조회 ${data.views}`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View
                                style={[
                                    styles.postImage,
                                    { backgroundColor: 'white' },
                                ]}
                            />
                            <View
                                style={{
                                    justifyContent: 'flex-end',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginVertical: 4,
                                    marginEnd: 20,
                                }}>
                                <IcLikes />
                                <Text
                                    style={[
                                        styles.postlikeCount,
                                        { marginStart: 1, marginEnd: 6 },
                                    ]}>
                                    {data.likes}
                                </Text>
                                <IcComment />
                                <Text
                                    style={[
                                        styles.postCommentCount,
                                        { marginStart: 2 },
                                    ]}>
                                    {data.comments}
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
                    <Text style={styles.boardTypeLabel}>전체 게시판</Text>
                </View>
                <View style={styles.line} />
            </View>
        )
    }

    const handleCategorySelect = (category: Category) => {
        if (currentCategory === category) {
            setCurrentCategory(Category.none)
            return
        }
        setCurrentCategory(category)
    }

    const renderItem: ListRenderItem<ItemProps> = ({ item }) => (
        <Post {...item} />
    )

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
    }

    const buttonColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [
            themeColor === lightColors ? baseColors.GRAY_3 : baseColors.GRAY_1,
            baseColors.SCHOOL_BG,
        ],
    })

    const iconColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [
            themeColor === lightColors ? baseColors.GRAY_2 : baseColors.GRAY_2,
            themeColor.BUTTON_TEXT,
        ],
    })

    return (
        <View style={styles.container}>
            <View style={styles.flatList}>
                <FlatList
                    ListHeaderComponent={FlatlistHeader}
                    showsVerticalScrollIndicator={false}
                    ref={flatlistRef}
                    data={flatlistData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
            <Animated.View
                style={[
                    styles.boardTypeToggleButton,
                    { backgroundColor: buttonColor },
                ]}>
                <TouchableOpacity onPress={toggleDropdown}>
                    <IcPinList fill={baseColors.WHITE} />
                </TouchableOpacity>
            </Animated.View>
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
                            onPress={() => handleCategorySelect(index)}>
                            <View style={styles.boardTypeItem}>
                                <Text
                                    style={[
                                        styles.boardTypeText,
                                        currentCategory === index &&
                                            styles.boardTypeTextActive,
                                    ]}>
                                    {boardType}
                                </Text>
                            </View>
                        </TouchableNativeFeedback>
                    ))}
                </ScrollView>
            </Animated.View>
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
            // backgroundColor:
            //     theme === lightColors ? baseColors.WHITE : baseColors.GRAY_3,
            elevation: 6,
        },
        boardTypeSelectionWrapper: {
            position: 'absolute',
            top: 60,
            right: 14,
            width: 160,
            borderRadius: 10,
            backgroundColor:
                theme === lightColors ? baseColors.WHITE : baseColors.GRAY_3,
            elevation: 4,
            zIndex: 1,
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
            color: theme.TEXT_SECONDARY,
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
            flex: 2,
            width: 72,
            height: 72,
            borderRadius: 10,
            marginTop: 12,
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
            marginVertical: 4,
        },
        postTitle: {
            color: theme.TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic-Bold',
        },
        postContent: {
            color: theme.TEXT,
            fontSize: 13,
            fontFamily: 'NanumGothic',
            lineHeight: 18,
        },
        postMetaData: {
            color: theme.TEXT_SECONDARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
        postlikeCount: {
            color: baseColors.LIGHT_RED,
            fontSize: 12,
            fontFamily: 'NanumGothic-Bold',
        },
        postCommentCount: {
            color: baseColors.LIGHT_BLUE,
            fontSize: 12,
            fontFamily: 'NanumGothic-Bold',
        },
    })

export default Board

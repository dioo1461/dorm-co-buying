import IcDisposableItem from '@/assets/drawable/ic-disposable-item.svg'
import IcFrozenItem from '@/assets/drawable/ic-frozen-item.svg'
import IcLocation from '@/assets/drawable/ic-location.svg'
import IcOthers from '@/assets/drawable/ic-others.svg'
import IcRefridgeratedItem from '@/assets/drawable/ic-refridgerated-item.svg'
import { CachedImage } from '@/components/CachedImage'
import Loading from '@/components/Loading'
import { baseColors, Icolor, lightColors } from '@/constants/colors'
import { GroupTradePostReduced } from '@/data/response/success/groupTrade/GetGroupTradePostListResponse'
import { queryGroupTradePostList } from '@/hooks/useQuery/groupTradeQuery'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import {
    RootStackParamList,
    stackNavigation,
} from '@/screens/navigation/NativeStackNavigation'
import { TradeCategory } from '@/types/TradeCategory'
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import {
    Animated,
    ListRenderItem,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native'

const FETCH_SIZE = 10

// TODO: 선택한 카테고리에 대한 공동구매글만 렌더링하도록 구현
// TODO: 스크롤 시 동적으로 헤더 숨김 / 표시
const categoryProps = [
    { categoryName: '전체', icon: <></> },
    {
        categoryName: '가공식품',
        icon: <IcFrozenItem />,
    },
    {
        categoryName: '신선식품',
        icon: <IcRefridgeratedItem />,
    },
    {
        categoryName: '음료/물',
        icon: <></>,
    },
    {
        categoryName: '의약폼',
        icon: <></>,
    },
    {
        categoryName: '일회용품',
        icon: <IcDisposableItem />,
    },
    {
        categoryName: '전자기기',
        icon: <></>,
    },
    {
        categoryName: '쿠폰',
        icon: <></>,
    },
    {
        categoryName: '기타',
        icon: <></>,
    },
]

const GroupTrade: React.FC = (): JSX.Element => {
    const { themeColor, boardList } = useBoundStore(state => ({
        themeColor: state.themeColor,
        boardList: state.boardList,
    }))

    const styles = createStyles(themeColor)
    const navigation = stackNavigation()
    const flatlistRef = useRef(null)

    const scrollY = useRef(new Animated.Value(0)).current
    const prevScrollY = useRef(0) // 이전 스크롤 위치 저장
    const categoryVisible = useRef(true) // 카테고리 선택창이 보이는지 여부 저장

    const categoryTranslateY = scrollY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -100], // -100만큼 위로 이동
        extrapolate: 'clamp',
    })

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentY = event.nativeEvent.contentOffset.y
        // 스크롤 방향에 따라 애니메이션 처리
        if (
            currentY > 50 &&
            currentY > prevScrollY.current &&
            categoryVisible.current
        ) {
            // 스크롤을 내리는 중이고 카테고리가 보이는 상태라면 숨기기
            Animated.timing(scrollY, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                categoryVisible.current = false
            })
        } else if (currentY < prevScrollY.current && !categoryVisible.current) {
            // 스크롤을 올리는 중이고 카테고리가 숨겨진 상태라면 보이기
            Animated.timing(scrollY, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                categoryVisible.current = true
            })
        }
        // 현재 스크롤 위치를 이전 위치로 저장
        prevScrollY.current = currentY
    }

    type GroupTradeRouteProp = RouteProp<RootStackParamList, 'GroupTrade'>
    const { params } = useRoute<GroupTradeRouteProp>()

    var refetchCallback: () => void

    useFocusEffect(() => {
        if (!!refetchCallback && params?.pendingRefresh) {
            refetchCallback()
            navigation.setParams({ pendingRefresh: false })
        }
    })

    const [currentCategory, setCurrentCategory] =
        useState<TradeCategory>('전체')

    const touchableNativeFeedbackBg = () => {
        return TouchableNativeFeedback.Ripple(
            themeColor === lightColors ? baseColors.GRAY_3 : baseColors.GRAY_1,
            false,
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
        const renderItem: ListRenderItem<GroupTradePostReduced> = ({
            item,
        }) => <Post {...item} />

        const boardId = boardList
            ? boardList.find(board => board.type === 'groupTradePost')?.id
            : undefined

        const {
            data,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            isLoading,
            error,
            refetch,
        } = queryGroupTradePostList(
            boardId!,
            currentCategory,
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
            <Animated.FlatList
                style={styles.flatList}
                ref={flatlistRef}
                data={posts}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        progressViewOffset={40}
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
                showsVerticalScrollIndicator={true}
                keyExtractor={item => item.postId.toString()}
                onEndReached={() => {
                    if (!isFetchingNextPage && hasNextPage) fetchNextPage()
                }}
                onEndReachedThreshold={0.5} // 스크롤이 50% 남았을 때 데이터 요청
                ListFooterComponent={<View style={{ height: 40 }} />} // 마지막 Post가 잘려 보이는 문제 임시 조치
                onScroll={onScroll}
            />
        )
    }

    const Post = (data: GroupTradePostReduced) => {
        return (
            <View>
                <TouchableNativeFeedback
                    style={styles.postContainer}
                    background={touchableNativeFeedbackBg()}
                    onPress={() =>
                        navigation.navigate('GroupTradePost', {
                            postId: data.postId,
                        })
                    }>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        {data.imageUrls.length > 0 ? (
                            <CachedImage
                                imageStyle={styles.postImage}
                                imageUrl={data.imageUrls[0]}
                            />
                        ) : (
                            <View style={styles.postImage} />
                        )}
                        <View style={styles.postContentContainer}>
                            <View>
                                <View
                                    style={{
                                        marginTop: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text style={styles.postTitle}>
                                        {data.title}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 10,
                                    }}>
                                    <IcLocation />
                                    <Text style={styles.postLocation}>
                                        {`${data.trade_location}ㆍ${Math.max(
                                            0,
                                            Math.ceil(
                                                (new Date(
                                                    data.trade_dueDate,
                                                ).getTime() -
                                                    new Date().getTime()) /
                                                    (1000 * 60 * 60 * 24),
                                            ),
                                        )}일 남음`}
                                    </Text>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={styles.postPrice}>{`${
                                        data.trade_count
                                    }개  ${data.trade_price.toLocaleString()} 원`}</Text>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text
                                        style={styles.postEachPrice}>{`개당 ${(
                                        data.trade_price / data.trade_count
                                    ).toFixed(0)} 원`}</Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                right: 10,
                                top: -4,
                            }}>
                            <TouchableNativeFeedback
                                background={touchableNativeFeedbackBg()}
                                useForeground={true}>
                                <View
                                    style={{
                                        borderRadius: 30,
                                        padding: 10,
                                        overflow: 'hidden',
                                    }}>
                                    <IcOthers fill={baseColors.GRAY_3} />
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 16,
                                right: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            {
                                // data.trade_nickNames.length + 1 <
                                data.trade_wanted ? (
                                    <View
                                        style={{
                                            backgroundColor:
                                                themeColor.BUTTON_BG,
                                            borderRadius: 30,
                                            padding: 6,
                                            marginEnd: 5,
                                        }}>
                                        <Text
                                            style={{
                                                color: themeColor.BUTTON_TEXT,
                                                fontFamily: 'NanumGothic-Bold',
                                                fontSize: 11,
                                            }}>
                                            참여 가능
                                        </Text>
                                    </View>
                                ) : (
                                    <View
                                        style={{
                                            backgroundColor: baseColors.GRAY_2,
                                            borderRadius: 30,
                                            padding: 6,
                                            marginEnd: 5,
                                        }}>
                                        <Text
                                            style={{
                                                color: baseColors.WHITE,
                                                fontFamily: 'NanumGothic-Bold',
                                                fontSize: 11,
                                            }}>
                                            마감
                                        </Text>
                                    </View>
                                )
                            }
                            <Text style={styles.postParticipants}>
                                {`${
                                    // data.trade_nickNames.length + 1
                                    null
                                } / ${data.trade_wanted}명`}
                            </Text>
                        </View>
                        <View style={styles.line} />
                    </View>
                </TouchableNativeFeedback>
                <View style={styles.line} />
            </View>
        )
    }

    const handleCategorySelect = (category: TradeCategory) => {
        if (currentCategory === category) {
            setCurrentCategory(category)
            return
        }
        setCurrentCategory(category)
    }

    return (
        <View style={styles.container}>
            <PostFlatList />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateGroupTradePost')}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
            <Animated.ScrollView
                style={[
                    styles.categoryContainer,
                    {
                        transform: [{ translateY: categoryTranslateY }],
                    },
                ]}
                horizontal
                contentContainerStyle={{ flexGrow: 1 }}
                showsHorizontalScrollIndicator={false}>
                {categoryProps.map((value, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.categoryButton,
                            currentCategory === value.categoryName
                                ? styles.selectedCategoryButton
                                : styles.unselectedCategoryButton,
                        ]}
                        onPress={() =>
                            handleCategorySelect(
                                value.categoryName as TradeCategory,
                            )
                        }>
                        {value.icon}
                        <Text style={styles.categoryText}>
                            {value.categoryName}
                        </Text>
                    </TouchableOpacity>
                ))}
            </Animated.ScrollView>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: { flex: 1 },
        categoryContainer: {
            position: 'absolute',
            backgroundColor: theme.BG,
            top: 0,
            left: 0,
            right: 0,
            flex: 1,
            flexDirection: 'row',
        },
        categoryButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingStart: 10,
            paddingVertical: 4,
            paddingEnd: 12,
            marginVertical: 8,
            marginStart: 10,
            borderRadius: 30,
            backgroundColor: baseColors.GRAY_2,
        },
        unselectedCategoryButton: {
            backgroundColor:
                theme === lightColors ? baseColors.GRAY_3 : baseColors.GRAY_1,
        },
        selectedCategoryButton: { backgroundColor: baseColors.SCHOOL_BG },
        categoryText: {
            color: baseColors.WHITE,
            fontFamily: 'NanumGothic',
            fontSize: 13,
        },
        flatList: {
            paddingTop: 40,
            // flex: 11,
        },
        postContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 6,
            paddingStart: 6,
        },
        postImage: { width: 100, height: 100, borderRadius: 10, margin: 10 },
        postContentContainer: { flex: 6, marginEnd: 20, flexDirection: 'row' },
        line: {
            borderBottomWidth: 1,
            borderBottomColor:
                theme === lightColors ? baseColors.GRAY_3 : baseColors.GRAY_1,
            marginHorizontal: 12,
            marginVertical: 4,
        },
        postTitle: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic',
        },
        postLocation: {
            color: theme.TEXT_SECONDARY,
            fontSize: 11,
            fontFamily: 'NanumGothic',
        },
        postDeadline: {
            color: theme.TEXT_SECONDARY,
            fontSize: 11,
            fontFamily: 'NanumGothic',
        },
        postPrice: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic-Bold',
        },
        postEachPrice: {
            color: theme.TEXT_SECONDARY,
            fontSize: 11,
            fontFamily: 'NanumGothic',
        },
        postParticipants: {
            color: theme.TEXT,
            fontSize: 13,
            fontFamily: 'NanumGothic',
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

export default GroupTrade

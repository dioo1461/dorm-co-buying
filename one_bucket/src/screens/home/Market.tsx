import IcDisposableItem from '@/assets/drawable/ic-disposable-item.svg'
import IcFrozenItem from '@/assets/drawable/ic-frozen-item.svg'
import IcLocation from '@/assets/drawable/ic-location.svg'
import IcRefridgeratedItem from '@/assets/drawable/ic-refridgerated-item.svg'
import IcOthers from '@/assets/drawable/ic-others.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import {
    RootStackParamList,
    stackNavigation,
} from '@/screens/navigation/NativeStackNavigation'
import React, { useEffect, useRef, useState } from 'react'
import {
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
import { TMarketCategory } from '@/data/TMarketCategory'
import { queryMarketPostList } from '@/hooks/useQuery/marketQuery'
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native'
import { MarketPostReduced } from '@/data/response/success/market/GetMarketPostListResponse'
import Loading from '@/components/Loading'

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

const Market: React.FC = (): JSX.Element => {
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
    const flatlistRef = useRef(null)

    type MarketRouteProp = RouteProp<RootStackParamList, 'Market'>
    const { params } = useRoute<MarketRouteProp>()

    var refetchCallback: () => void

    useFocusEffect(() => {
        if (!!refetchCallback && params?.pendingRefresh) {
            refetchCallback()
            navigation.setParams({ pendingRefresh: false })
        }
    })

    const [currentCategory, setCurrentCategory] =
        useState<TMarketCategory>('기타')

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
        const renderItem: ListRenderItem<MarketPostReduced> = ({ item }) => (
            <Post {...item} />
        )

        const boardId = boardList
            ? boardList.find(board => board.type === 'marketPost')?.id
            : undefined

        const {
            data, // 각 페이지의 데이터를 담고 있음
            fetchNextPage, // 다음 페이지 불러오기 함수
            hasNextPage, // 다음 페이지가 있는지 여부
            isFetchingNextPage, // 다음 페이지 불러오는 중인지 여부
            isLoading, // 첫 번째 페이지 로딩 여부
            error,
            refetch,
        } = queryMarketPostList(
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

    const Post = (data: MarketPostReduced) => {
        return (
            <View>
                <TouchableNativeFeedback
                    style={styles.postContainer}
                    background={touchableNativeFeedbackBg()}
                    onPress={() =>
                        navigation.navigate('MarketPost', {
                            postId: data.postId,
                        })
                    }>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View
                            style={[
                                styles.postImage,
                                { backgroundColor: 'white' },
                            ]}
                        />
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
                            {data.trade_nickNames.length + 1 <
                            data.trade_wanted ? (
                                <View
                                    style={{
                                        backgroundColor: themeColor.BUTTON_BG,
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
                            )}
                            <Text style={styles.postParticipants}>
                                {`${data.trade_nickNames.length + 1} / ${
                                    data.trade_wanted
                                }명`}
                            </Text>
                        </View>
                        <View style={styles.line} />
                    </View>
                </TouchableNativeFeedback>
                <View style={styles.line} />
            </View>
        )
    }

    const handleCategorySelect = (category: TMarketCategory) => {
        if (currentCategory === category) {
            setCurrentCategory(category)
            return
        }
        setCurrentCategory(category)
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.categoryContainer}
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
                                value.categoryName as TMarketCategory,
                            )
                        }>
                        {value.icon}
                        <Text style={styles.categoryText}>
                            {value.categoryName}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.flatList}>
                <PostFlatList />
            </View>
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateMarketPost')}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: { flex: 1 },
        categoryContainer: { flex: 1, flexDirection: 'row' },
        categoryButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingStart: 10,
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
            flex: 11,
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

export default Market

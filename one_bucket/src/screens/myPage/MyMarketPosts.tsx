import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcLocation from '@/assets/drawable/ic-location.svg'
import IcOthers from '@/assets/drawable/ic-others.svg'
import { CachedImage } from '@/components/CachedImage'
import Loading from '@/components/Loading'
import { baseColors, Icolor, lightColors } from '@/constants/colors'
import strings from '@/constants/strings'
import { MarketPostReduced } from '@/data/response/success/market/GetMarketPostListResponse'
import { queryMyMarketPostList } from '@/hooks/useQuery/marketQuery'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import {
    RootStackParamList,
    stackNavigation,
} from '@/screens/navigation/NativeStackNavigation'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useLayoutEffect, useRef, useState } from 'react'
import {
    Animated,
    ListRenderItem,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native'

const FETCH_SIZE = 10

const MyMarketPosts: React.FC = (): JSX.Element => {
    const { themeColor, boardList } = useBoundStore(state => ({
        themeColor: state.themeColor,
        boardList: state.boardList,
    }))

    useLayoutEffect(() => {
        navigation.setOptions({
            title: strings.myMarketPostsScreenTitle,
            headerStyle: {
                backgroundColor: themeColor.HEADER_BG,
            },
            headerTitleStyle: {
                color: themeColor.HEADER_TEXT,
                fontFamily: 'NanumGothic',
                fontSize: 18,
            },
            headerLeft: () => (
                <TouchableOpacity
                    style={{ marginLeft: 16 }}
                    onPress={() => navigation.goBack()}>
                    <IcAngleLeft fill={themeColor.HEADER_TEXT} />
                </TouchableOpacity>
            ),
        })
    }, [])

    const styles = createStyles(themeColor)
    const navigation = stackNavigation()
    const flatlistRef = useRef(null)

    type MarketRouteProp = RouteProp<RootStackParamList, 'MyMarketPosts'>
    const { params } = useRoute<MarketRouteProp>()

    var refetchCallback: () => void

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

        const {
            data,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            isLoading,
            error,
            refetch,
        } = queryMyMarketPostList(
            {
                sortType: 'createdDate',
                sort: 'desc',
            },
            FETCH_SIZE,
        )
        refetchCallback = refetch

        if (error) return <Text>Error...</Text>

        if (isLoading) return <Loading theme={themeColor} />

        const posts = data?.pages?.flatMap(page => page.content)
        console.log(data?.pages.flatMap(page => page.content))
        return (
            <Animated.FlatList
                style={styles.flatList}
                ref={flatlistRef}
                data={posts}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
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
            />
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
                                    <Text
                                        style={
                                            styles.postPrice
                                        }>{`${data.trade_count}개  ${data.trade_price} 원`}</Text>
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
                            {data.trade_nickNames?.length + 1 <
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
                                {`${data.trade_nickNames?.length + 1} / ${
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

    return (
        <View style={styles.container}>
            <PostFlatList />
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
            paddingTop: 10,
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

export default MyMarketPosts

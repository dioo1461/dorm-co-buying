import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useEffect, useRef, useState } from 'react'
import {
    Animated,
    Appearance,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    View,
} from 'react-native'
import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcShare from '@/assets/drawable/ic-share.svg'
import IcOthers from '@/assets/drawable/ic-others.svg'
import { TouchableOpacity } from 'react-native'
import {
    RootStackParamList,
    stackNavigation,
} from '../../navigation/NativeStackNavigation'
import IcLocation from '@/assets/drawable/ic-location.svg'
import IcHeart from '@/assets/drawable/ic-heart.svg'
import { RouteProp, useRoute } from '@react-navigation/native'
import { queryMarketPost } from '@/hooks/useQuery/marketQuery'
import Loading from '@/components/Loading'
import { OpenGraphParser } from '@sleiv/react-native-opengraph-parser'
import { GetMarketPostResponse } from '@/data/response/success/market/GetMarketPostResponse'
import { CachedImage } from '@/components/CachedImage'
import { joinTrade } from '@/apis/tradeService'

// link preview 보안 문제 ? (악의적 스크립트 삽입)

const [SCREEN_WIDTH, SCREEN_HEIGHT] = [
    Dimensions.get('window').width,
    Dimensions.get('window').height,
]

const MarketPost: React.FC = (): JSX.Element => {
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

    type MarketPostRouteProp = RouteProp<RootStackParamList, 'MarketPost'>
    const { params } = useRoute<MarketPostRouteProp>()

    // 레이아웃 관련 변수
    const scrollY = useRef(new Animated.Value(0)).current

    // 상태 관리 변수
    const [metaData, setMetaData] = useState<any>(null)

    const onSuccessCallback = (data: GetMarketPostResponse) => {
        const parseMetaData = async (url: string) => {
            OpenGraphParser.extractMeta(url)
                .then(data => {
                    console.log(data)
                    const hostname = data[0].url.split('/')[2]

                    const meta = {
                        title: data[0].title,
                        description: data[0].description,
                        url: hostname,
                        image: data[0].image,
                        'image:width': data[0]['image:width'],
                        'image:height': data[0]['image:height'],
                    }
                    setMetaData(meta)
                    console.log(meta)
                })
                .catch(error => {
                    setMetaData(null)
                    console.log('error occurred while parsing url -' + error)
                })
        }

        if (data?.trade_linkUrl) {
            parseMetaData(data.trade_linkUrl)
        }
    }

    const onJoinButtonPress = async () => {
        await joinTrade(data!.trade_id).then(() => {
            navigation.goBack()
        })
    }

    const { data, isLoading, error } = queryMarketPost(
        params.postId,
        onSuccessCallback,
    )

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 300], // 스크롤 범위
        outputRange: [0, 1], // opacity 값 변화
        extrapolate: 'clamp', // 값이 범위를 벗어나지 않게 고정
    })

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false },
    )

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
                    {data?.imageUrls?.map((url, index) => (
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
                <View style={styles.profileContainer}>
                    {/* TODO: 프로필 사진 */}
                    <View></View>
                    <Text style={styles.usernameText}>
                        {data?.authorNickname}
                    </Text>
                </View>
                {/* ### 본문 ### */}
                <View style={styles.bodyContainer}>
                    <Text style={styles.titleText}>{data?.title}</Text>
                    <Text
                        style={
                            styles.metadataText
                        }>{`2시간 전ㆍ${data?.trade_tag}`}</Text>
                    <Text style={styles.contentText}>{data?.text}</Text>
                    {/* ### 사이트 링크 프리뷰 ### */}
                    {data?.trade_linkUrl &&
                        (metaData ? (
                            <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple(
                                    baseColors.GRAY_2,
                                    false,
                                )}>
                                <View style={styles.linkPreviewContainer}>
                                    {/* ### 프리뷰 이미지 ### */}
                                    {metaData!.image && (
                                        <View
                                            style={{
                                                width: 112,
                                                height: 112,
                                            }}>
                                            <CachedImage
                                                imageUrl={metaData!.image}
                                                imageStyle={{
                                                    width: 112,
                                                    height: 112,
                                                }}
                                                externalUrl={true}
                                            />
                                        </View>
                                    )}
                                    <View
                                        style={{
                                            flex: 1,
                                            padding: 10,
                                            justifyContent: 'space-between',
                                        }}>
                                        <Text
                                            style={styles.linkPreviewTitleText}>
                                            {metaData?.title}
                                        </Text>
                                        <Text style={styles.linkPreviewUrlText}>
                                            {metaData?.url}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        ) : (
                            <Text>{data?.trade_linkUrl}</Text>
                        ))}
                    {/* ### 거래 희망 장소 ### */}
                    <View>
                        <Text style={styles.locationLabel}>거래 희망 장소</Text>
                    </View>
                    <View style={styles.locationMapContainer}></View>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IcLocation width={24} height={24} />
                        <Text style={styles.locationText}>A동 1층</Text>
                    </View>
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
                    <IcAngleLeft
                        fill={
                            themeColor === lightColors
                                ? baseColors.GRAY_1
                                : baseColors.GRAY_4
                        }
                    />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity>
                        <IcShare
                            fill={
                                themeColor === lightColors
                                    ? baseColors.GRAY_1
                                    : baseColors.GRAY_4
                            }
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <IcOthers
                            fill={
                                themeColor === lightColors
                                    ? baseColors.GRAY_1
                                    : baseColors.GRAY_4
                            }
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {/* ### 하단 바 ### */}
            <View style={styles.bottomBarContainer}>
                <TouchableOpacity>
                    <IcHeart />
                </TouchableOpacity>
                <View style={{ position: 'relative', left: -16 }}>
                    <Text style={styles.bottomBarLabel}>남은 수량</Text>
                    <Text style={styles.bottomBarLabel}>모집 인원</Text>
                </View>
                <View style={{ position: 'relative', left: 0 }}>
                    <Text style={styles.bottomBarCountText}>12 / 30</Text>
                    <Text style={styles.bottomBarCountText}>3 / 5</Text>
                </View>
                <TouchableOpacity
                    style={styles.joinButton}
                    onPress={onJoinButtonPress}>
                    <Text style={styles.bottomBarButtonText}>참여하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: { flex: 1 },
        imageContainer: {
            width: SCREEN_WIDTH,
            height: SCREEN_WIDTH,
            backgroundColor: 'gray',
        },
        profileContainer: {
            flexDirection: 'row',
            paddingVertical: 20,
            paddingHorizontal: 16,
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
        },
        bottomBarButtonText: {
            color: theme.BUTTON_TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 14,
        },
        joinButton: {
            backgroundColor: theme.BUTTON_BG,
            padding: 10,
            borderRadius: 8,
        },
    })

export default MarketPost

import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
    Animated,
    Appearance,
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import IcClose from '@/assets/drawable/ic-close.svg'
import { RouteProp, useRoute } from '@react-navigation/native'
import {
    RootStackParamList,
    stackNavigation,
} from '@/screens/navigation/NativeStackNavigation'
import { Image } from 'react-native'
import {
    HandlerStateChangeEvent,
    PanGestureHandler,
    PinchGestureHandler,
    PinchGestureHandlerEventPayload,
    State,
} from 'react-native-gesture-handler'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const ImageEnlargement: React.FC = (): JSX.Element => {
    const { themeColor, setThemeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
        setThemeColor: state.setThemeColor,
    }))

    type ImageEnlargementProps = RouteProp<
        RootStackParamList,
        'ImageEnlargement'
    >
    const { params } = useRoute<ImageEnlargementProps>()
    const navigation = stackNavigation()
    const scrollViewRef = useRef<ScrollView>(null)

    const [currentIndex, setCurrentIndex] = useState<number>(params.index)

    // 다크모드 변경 감지
    useEffect(() => {
        const themeSubscription = Appearance.addChangeListener(
            ({ colorScheme }) => {
                setThemeColor(colorScheme === 'dark' ? darkColors : lightColors)
            },
        )
        return () => themeSubscription.remove()
    }, [])

    useEffect(() => {
        scrollViewRef.current?.scrollTo({
            x: SCREEN_WIDTH * params.index,
            animated: false,
        })
    }, [])

    const handleScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const scrollPosition = event.nativeEvent.contentOffset.x
            const newIndex = Math.floor(
                scrollPosition / event.nativeEvent.layoutMeasurement.width,
            )

            setCurrentIndex(newIndex)
        },
        [currentIndex],
    )

    const styles = createStyles(themeColor)

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                maximumZoomScale={4}
                minimumZoomScale={1}>
                {params.imageUriList.map((value: string, idx: number) => {
                    const scale = useRef(new Animated.Value(1)).current
                    const translateX = useRef(new Animated.Value(0)).current
                    const translateY = useRef(new Animated.Value(0)).current

                    let lastScale = 1
                    let lastTranslateX = 0
                    let lastTranslateY = 0

                    const onPanEvent = Animated.event(
                        [
                            {
                                nativeEvent: {
                                    translationX: translateX,
                                    translationY: translateY,
                                },
                            },
                        ],
                        { useNativeDriver: false },
                    )

                    const onPanStateChange = (event: any) => {
                        if (event.nativeEvent.oldState === State.ACTIVE) {
                            lastTranslateX += event.nativeEvent.translationX
                            lastTranslateY += event.nativeEvent.translationY

                            const maxTranslateX =
                                (SCREEN_WIDTH * (lastScale - 1)) / 2
                            const maxTranslateY =
                                (SCREEN_HEIGHT * (lastScale - 1)) / 2

                            lastTranslateX = Math.max(
                                -maxTranslateX,
                                Math.min(lastTranslateX, maxTranslateX),
                            )
                            lastTranslateY = Math.max(
                                -maxTranslateY,
                                Math.min(lastTranslateY, maxTranslateY),
                            )

                            translateX.setOffset(lastTranslateX)
                            translateX.setValue(0)
                            translateY.setOffset(lastTranslateY)
                            translateY.setValue(0)
                        }
                    }

                    const onPinchStateChange = (
                        event: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>,
                    ) => {
                        if (event.nativeEvent.oldState === State.ACTIVE) {
                            if (event.nativeEvent.scale < 1) {
                                Animated.spring(scale, {
                                    toValue: 1,
                                    useNativeDriver: false,
                                }).start()
                            } else if (event.nativeEvent.scale > 4) {
                                Animated.spring(scale, {
                                    toValue: 4,
                                    useNativeDriver: false,
                                }).start()
                            }
                        }
                    }
                    const onPinchEvent = Animated.event(
                        [{ nativeEvent: { scale: scale } }],
                        { useNativeDriver: false },
                    )
                    return (
                        <PanGestureHandler
                            minPointers={1}
                            maxPointers={1}
                            key={idx}
                            onGestureEvent={onPanEvent}
                            onHandlerStateChange={onPanStateChange}>
                            {/* <Animated.View> */}
                            <PinchGestureHandler
                                minPointers={2}
                                maxPointers={2}
                                onGestureEvent={onPinchEvent}
                                onHandlerStateChange={onPinchStateChange}>
                                <Animated.View
                                    style={{
                                        transform: [
                                            { scale: scale },
                                            {
                                                translateX: translateX,
                                            },
                                            {
                                                translateY: translateY,
                                            },
                                        ],
                                    }}>
                                    <Image
                                        style={[styles.image, {}]}
                                        source={{ uri: value }}
                                    />
                                </Animated.View>
                            </PinchGestureHandler>
                            {/* </Animated.View> */}
                        </PanGestureHandler>
                    )
                })}
            </ScrollView>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IcClose width={32} height={32} fill={baseColors.WHITE} />
                </TouchableOpacity>
                <View style={styles.counterContainer}>
                    <Text style={styles.counterText}>
                        {currentIndex + 1} / {params.imageUriList.length}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'black',
        },
        scrollView: {
            width: '100%',
            height: '100%',
        },
        image: {
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            resizeMode: 'contain',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'absolute',
            top: 0,
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: 10,
        },
        counterContainer: {
            flex: 1,
            alignItems: 'center',
        },
        counterText: {
            color: 'white',
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
    })

export default ImageEnlargement

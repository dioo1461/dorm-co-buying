import IcClose from '@/assets/drawable/ic-close.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import {
    RootStackParamList,
    stackNavigation,
} from '@/screens/navigation/NativeStackNavigation'
import { CachedImage } from '@/components/CachedImage'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
    Animated,
    Appearance,
    Dimensions,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
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
    const panRef = useRef<PanGestureHandler>(null)
    const pinchRef = useRef<PinchGestureHandler>(null)

    const [currentIndex, setCurrentIndex] = useState<number>(params.index)

    const imagePromiseList = useRef<Promise<void>[]>([])
    const [isImageLoaded, setImageLoaded] = useState(false)

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
        console.log(imagePromiseList.current.length)
        Promise.all(imagePromiseList.current)
            .then(() => setImageLoaded(true))
            .catch(err => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        scrollViewRef.current?.scrollTo({
            x: SCREEN_WIDTH * params.index,
            animated: false,
        })
    }, [isImageLoaded])

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

    const loadCheck = new Array(params.imageUriList.length).fill(false)

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
                {params.imageUriList.map((uri: string, idx: number) => {
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
                    return params.isLocalUri ? (
                        <Image
                            key={idx}
                            style={[styles.image, {}]}
                            source={{ uri: uri }}
                        />
                    ) : (
                        <CachedImage
                            key={idx}
                            imageStyle={styles.image}
                            imageUrl={uri}
                            onLoad={res => imagePromiseList.current.push(res)}
                        />
                    )
                    // TODO: 이미지 확대 및 축소 기능 추가
                    //
                    // <PanGestureHandler
                    //     minPointers={1}
                    //     maxPointers={1}
                    //     key={idx}
                    //     onGestureEvent={onPanEvent}
                    //     onHandlerStateChange={onPanStateChange}
                    //     simultaneousHandlers={[pinchRef, scrollViewRef]}>
                    //     {/* <Animated.View> */}
                    //     <PinchGestureHandler
                    //         minPointers={2}
                    //         maxPointers={2}
                    //         onGestureEvent={onPinchEvent}
                    //         onHandlerStateChange={onPinchStateChange}
                    //         simultaneousHandlers={[
                    //             pinchRef,
                    //             scrollViewRef,
                    //         ]}>
                    //         <Animated.View
                    //             style={{
                    //                 transform: [
                    //                     { scale: scale },
                    //                     {
                    //                         translateX: translateX,
                    //                     },
                    //                     {
                    //                         translateY: translateY,
                    //                     },
                    //                 ],
                    //             }}>
                    //             <Image
                    //                 style={[styles.image, {}]}
                    //                 source={{ uri: value }}
                    //             />
                    //         </Animated.View>
                    //     </PinchGestureHandler>
                    //     {/* </Animated.View> */}
                    // </PanGestureHandler>
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

import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
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
                scrollEventThrottle={16}>
                {params.imageUriList.map((value: string, idx: number) => (
                    <View style={styles.imageContainer} key={idx}>
                        <Image style={styles.image} source={{ uri: value }} />
                    </View>
                ))}
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
        imageContainer: {
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
        },
        image: {
            width: '100%',
            height: '100%',
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

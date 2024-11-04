import { baseColors, Icolor } from '@/constants/colors'
import { useEffect, useRef } from 'react'
import { Animated, Dimensions, StyleSheet, View } from 'react-native'
import Backdrop from '../Backdrop'

type BottomSheetProps = {
    enabled: boolean
    onClose: () => void
    theme: Icolor
    jsxElement: () => JSX.Element
}

const BottomSheet: React.FC<BottomSheetProps> = ({
    enabled,
    onClose,
    theme,
    jsxElement,
}): JSX.Element => {
    const styles = createStyles(theme)

    const animation = useRef(new Animated.Value(0)).current

    const commonAnimatedStyle = {
        opacity: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        }),
    }
    const popupAnimatedStyle = {
        transform: [
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [Dimensions.get('window').height, 0], // 아래에서 위로 올라옴
                }),
            },
        ],
    }

    useEffect(() => {
        Animated.timing(animation, {
            toValue: enabled ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start()
    }, [enabled])

    return (
        <View
            style={[
                styles.overlay,
                { pointerEvents: enabled ? 'auto' : 'none' },
            ]}>
            <Backdrop enabled={enabled} onPress={onClose} />
            <Animated.View
                style={[
                    styles.container,
                    commonAnimatedStyle,
                    popupAnimatedStyle,
                ]}>
                {jsxElement()}
            </Animated.View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        overlay: {
            position: 'absolute',
            width: '100%',
            height: '100%',
        },
        container: {
            backgroundColor: theme.BG,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute',
            padding: 18,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'flex-end',
            zIndex: 1,
        },
        buttonsContainer: {
            backgroundColor: theme.BG_SECONDARY,
            width: '100%',
            borderRadius: 10,
            paddingVertical: 4,
            zIndex: 2,
        },
        button: {
            paddingVertical: 15,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            fontFamily: 'NanumGothic',
            fontSize: 14,
            color: theme.TEXT,
        },
        destructiveButtonText: {
            fontFamily: 'NanumGothic',
            fontSize: 14,
            color: baseColors.RED,
        },
    })

export default BottomSheet

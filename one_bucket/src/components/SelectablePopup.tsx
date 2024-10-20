import { baseColors, Icolor } from '@/constants/colors'
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Backdrop from './Backdrop'
import Line from './Line'
import { useEffect, useRef } from 'react'

type SelectablePopupProps = {
    enabled: boolean
    handleClose: () => void
    theme: Icolor
    buttons: {
        text: string
        style: 'default' | 'destructive'
        onPress: () => void
    }[]
}

export const SelectablePopup: React.FC<SelectablePopupProps> = ({
    enabled,
    handleClose,
    theme,
    buttons,
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
            <Animated.View
                style={[
                    styles.container,
                    commonAnimatedStyle,
                    popupAnimatedStyle,
                ]}>
                <View style={styles.buttonsContainer}>
                    {buttons.map((buttonProp, index) => {
                        let textStyle
                        switch (buttonProp.style) {
                            case 'default':
                                textStyle = styles.buttonText
                                break
                            case 'destructive':
                                textStyle = styles.destructiveButtonText
                                break
                        }
                        return (
                            <View key={index}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={buttonProp.onPress}>
                                    <Text style={textStyle}>
                                        {buttonProp.text}
                                    </Text>
                                </TouchableOpacity>
                                {index !== buttons.length - 1 && (
                                    <Line theme={theme} />
                                )}
                            </View>
                        )
                    })}
                </View>
                <View style={[styles.buttonsContainer, { marginTop: 10 }]}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleClose}>
                        <Text style={styles.buttonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
            {/* Backdrop 클릭 시 팝업 닫기 */}
            <Backdrop enabled={enabled} onPress={handleClose} />
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        overlay: {
            backgroundColor: theme.BG,
            position: 'absolute',
            padding: 18,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'flex-end',
            zIndex: 1,
        },
        container: {
            width: '100%',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            zIndex: 2,
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

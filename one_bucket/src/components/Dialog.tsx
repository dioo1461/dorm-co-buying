import { baseColors, Icolor } from '@/constants/colors'
import { useEffect, useRef } from 'react'
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native'
import Backdrop from '@/components/Backdrop'

export type DialogButtonProps = {
    text: string
    style: 'primary' | 'secondary' | 'destructive'
    onPress: () => void
}

type DialogProps = {
    enabled: boolean
    title: string
    content: string
    theme: Icolor
    buttons: DialogButtonProps[]
    onClose: () => void
    containerStyle?: ViewStyle
}

const Dialog: React.FC<DialogProps> = ({
    title,
    content,
    enabled,
    onClose,
    theme,
    buttons,
    containerStyle,
}): JSX.Element => {
    const styles = createStyles(theme)

    const animation = useRef(new Animated.Value(0)).current
    const screenHeight = Dimensions.get('window').height

    const animatedOpacity = animation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 1, 0],
        extrapolate: 'clamp',
    })

    const animatedTranslateY = animation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [screenHeight / 4, 0, -screenHeight / 4],
        extrapolate: 'clamp',
    })

    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        if (enabled) {
            Animated.timing(animation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start()
        } else {
            Animated.timing(animation, {
                toValue: 2,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                animation.setValue(0)
            })
        }
    }, [enabled])

    return (
        <View
            style={[
                styles.overlay,
                { pointerEvents: enabled ? 'auto' : 'none' },
            ]}>
            <Backdrop enabled={enabled} onPress={onClose ?? (() => {})} />
            <Animated.View
                style={[
                    styles.container,
                    {
                        transform: [{ translateY: animatedTranslateY }],
                        opacity: animatedOpacity,
                    },
                    containerStyle,
                ]}>
                {/* Dialog 내용 */}
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.contentText}>{content}</Text>
                <View style={styles.buttonsContainer}>
                    {buttons.map((button, index) => (
                        <TouchableOpacity
                            key={index}
                            style={
                                button.style === 'primary'
                                    ? styles.primaryButton
                                    : button.style === 'secondary'
                                    ? styles.secondaryButton
                                    : styles.destructiveButton
                            }
                            onPress={button.onPress}>
                            <Text
                                style={
                                    button.style === 'primary'
                                        ? styles.primaryButtonText
                                        : button.style === 'secondary'
                                        ? styles.secondaryButtonText
                                        : styles.destructiveButtonText
                                }>
                                {button.text}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            position: 'absolute',
            width: '100%',
            height: '100%',
            elevation: 5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        container: {
            backgroundColor: theme.BG,
            borderRadius: 20,
            padding: 18,
            justifyContent: 'center',
            zIndex: 1,
        },
        titleText: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 16,
            textAlign: 'center',
            marginVertical: 8,
        },
        contentText: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 14,
            textAlign: 'center',
            marginVertical: 10,
            lineHeight: 22,
        },
        buttonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 10,
        },
        primaryButton: {
            flex: 1,
            backgroundColor: theme.BUTTON_BG,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
            paddingHorizontal: 20,
            marginHorizontal: 5,
            borderRadius: 30,
        },
        secondaryButton: {
            backgroundColor: theme.BUTTON_SECONDARY_BG,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
            paddingHorizontal: 20,
            marginHorizontal: 5,
            borderRadius: 30,
        },
        destructiveButton: {
            backgroundColor: baseColors.RED,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
            paddingHorizontal: 20,
            marginHorizontal: 5,
            borderRadius: 30,
        },
        primaryButtonText: {
            color: theme.BUTTON_TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 14,
        },
        secondaryButtonText: {
            color: theme.BUTTON_SECONDARY_TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 14,
            alignSelf: 'center',
        },
        destructiveButtonText: {
            color: baseColors.WHITE,
            fontFamily: 'NanumGothic',
            fontSize: 14,
            alignSelf: 'center',
        },
    })

export default Dialog

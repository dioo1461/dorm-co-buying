import { baseColors, Icolor } from '@/constants/colors'
import {
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    View,
    Platform,
} from 'react-native'

import BottomSheet from '@/components/bottomSheet/BottomSheet'
import Line from '@/components/Line'

type SelectableBottomSheetProps = {
    enabled: boolean
    onClose: () => void
    theme: Icolor
    buttons: {
        text: string
        style: 'default' | 'destructive'
        onPress: () => void
    }[]
}

export const SelectableBottomSheet: React.FC<SelectableBottomSheetProps> = ({
    enabled,
    onClose,
    theme,
    buttons,
}): JSX.Element => {
    const styles = createStyles(theme)

    return (
        <BottomSheet
            enabled={enabled}
            onClose={onClose}
            theme={theme}
            jsxElement={() => (
                <View>
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
                                    <View style={styles.touchableWrapper}>
                                        <TouchableNativeFeedback
                                            onPress={buttonProp.onPress}
                                            background={TouchableNativeFeedback.Ripple(
                                                theme.TEXT_SECONDARY,
                                                false, // 리플 효과가 경계를 넘지 않도록 설정
                                            )}>
                                            <View style={styles.button}>
                                                <Text style={textStyle}>
                                                    {buttonProp.text}
                                                </Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>
                                    {index !== buttons.length - 1 && (
                                        <Line theme={theme} />
                                    )}
                                </View>
                            )
                        })}
                    </View>
                    <View style={[styles.buttonsContainer, { marginTop: 10 }]}>
                        <View style={styles.touchableWrapper}>
                            <TouchableNativeFeedback
                                onPress={onClose}
                                background={TouchableNativeFeedback.Ripple(
                                    theme.TEXT_SECONDARY,
                                    false,
                                )}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>닫기</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </View>
            )}
        />
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
        touchableWrapper: {
            borderRadius: 10, // 리플 효과가 맞춰질 radius
            overflow: 'hidden', // 리플 효과가 반경을 넘지 않도록 설정
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
        backdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
    })

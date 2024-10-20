import { baseColors, Icolor } from '@/constants/colors'
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Backdrop from './Backdrop'
import Line from './Line'

type SelectablePopupProps = {
    enabled: boolean
    onBackgroundPress: () => void
    theme: Icolor
    buttons: {
        text: string
        style: 'default' | 'destructive'
        onPress: () => void
    }[]
}

export const SelectablePopup: React.FC<SelectablePopupProps> = ({
    enabled,
    onBackgroundPress,
    theme,
    buttons,
}): JSX.Element => {
    const styles = createStyles(theme)

    console.log(buttons)
    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
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
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Backdrop 클릭 시 팝업 닫기 */}
            <Backdrop enabled={enabled} onPress={onBackgroundPress} />
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

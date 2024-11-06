import { baseColors, Icolor } from '@/constants/colors'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

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
                            onPress={onClose}>
                            <Text style={styles.buttonText}>닫기</Text>
                        </TouchableOpacity>
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

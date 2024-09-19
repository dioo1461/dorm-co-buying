import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcClose from '@/assets/drawable/ic-close.svg'
import IcNotification from '@/assets/drawable/ic-angle-left.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useEffect, useState } from 'react'
import {
    Appearance,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const AlertSetting: React.FC = (): React.JSX.Element => {
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

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()

    const [tempValue1, setTempValue1] = useState(false)
    const [tempValue2, setTempValue2] = useState(false)

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.contextContainer,
                    {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    },
                ]}>
                <Text style={[styles.contextLabel, { flex: 1 }]}>
                    채팅 알림
                </Text>
                <View
                    style={{
                        flex: 1,
                        position: 'relative',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Switch
                        style={styles.switch}
                        trackColor={
                            themeColor === lightColors
                                ? {
                                    false: baseColors.GRAY_3,
                                    true: baseColors.SCHOOL_BG_LIGHT,
                                }
                                : {
                                    false: baseColors.GRAY_3,
                                    true: baseColors.SCHOOL_BG_LIGHT,
                                }
                        }
                        thumbColor={
                            tempValue1
                                ? baseColors.SCHOOL_BG
                                : themeColor === lightColors
                                ? baseColors.WHITE
                                : baseColors.GRAY_2
                        }
                        value={tempValue1}
                        onValueChange={() => {
                            setTempValue1(!tempValue1)
                            setTempValue1(!tempValue1)
                        }}
                        />
                </View>
            </View>
            <View
                style={[
                    styles.contextContainer,
                    {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    },
                ]}>
                <Text style={[styles.contextLabel, { flex: 1 }]}>
                    댓글 알림
                </Text>
                <View
                    style={{
                        flex: 1,
                        position: 'relative',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Switch
                        style={styles.switch}
                        trackColor={
                            themeColor === lightColors
                                ? {
                                    false: baseColors.GRAY_3,
                                    true: baseColors.SCHOOL_BG_LIGHT,
                                }
                                : {
                                    false: baseColors.GRAY_3,
                                    true: baseColors.SCHOOL_BG_LIGHT,
                                }
                        }
                        thumbColor={
                            tempValue2
                                ? baseColors.SCHOOL_BG
                                : themeColor === lightColors
                                ? baseColors.WHITE
                                : baseColors.GRAY_2
                        }
                        value={tempValue2}
                        onValueChange={() => {
                            setTempValue2(!tempValue2)
                            setTempValue2(!tempValue2)
                        }}
                        />
                </View>
            </View>
        </View>
    )
}

const CreateStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.BG,
            paddingHorizontal: 16,
            paddingTop: 8,
        },
        contextContainer: {
            padding: 16,
        },
        contextLabel: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic',
        },
        switch: {
            position: 'absolute',
            right: -12,
        },

    })

export default AlertSetting
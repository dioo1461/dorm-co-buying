import { baseColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import { setGlobalChatNotificationEnabled } from '@/utils/asyncStorageUtils'
import { useState } from 'react'
import { Dimensions, StyleSheet, Switch, Text, View } from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const AlertSetting: React.FC = (): React.JSX.Element => {
    const { themeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
    }))

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()

    const [chatNotificationEnabled, setChatNotificationEnabled] =
        useState(false)
    const [commentNotificationEnabled, setCommentNotificationEnabled] =
        useState(false)

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
                        trackColor={{
                            false: baseColors.GRAY_3,
                            true: baseColors.SCHOOL_BG_LIGHT,
                        }}
                        thumbColor={
                            chatNotificationEnabled
                                ? baseColors.SCHOOL_BG
                                : themeColor === lightColors
                                ? baseColors.WHITE
                                : baseColors.GRAY_2
                        }
                        value={chatNotificationEnabled}
                        onValueChange={() => {
                            setGlobalChatNotificationEnabled(
                                !chatNotificationEnabled,
                            )
                            setChatNotificationEnabled(!chatNotificationEnabled)
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
                        trackColor={{
                            false: baseColors.GRAY_3,
                            true: baseColors.SCHOOL_BG_LIGHT,
                        }}
                        thumbColor={
                            commentNotificationEnabled
                                ? baseColors.SCHOOL_BG
                                : themeColor === lightColors
                                ? baseColors.WHITE
                                : baseColors.GRAY_2
                        }
                        value={commentNotificationEnabled}
                        onValueChange={() => {
                            setGlobalChatNotificationEnabled(
                                !commentNotificationEnabled,
                            )
                            setCommentNotificationEnabled(
                                !commentNotificationEnabled,
                            )
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

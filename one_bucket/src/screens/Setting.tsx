import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { AppContext } from '@/hooks/useContext/AppContext'
import {
    getAlertSoundEnabled,
    getAlertVibrationEnabled,
    setAlertSoundEnabled,
    setAlertVibrationEnabled,
} from '@/utils/asyncStorageUtils'
import { useContext, useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Appearance,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

const Setting: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor, onLogOut } = useContext(AppContext)
    // 다크모드 변경 감지
    useEffect(() => {
        const themeSubscription = Appearance.addChangeListener(
            ({ colorScheme }) => {
                setThemeColor(colorScheme === 'dark' ? darkColors : lightColors)
            },
        )
        return () => themeSubscription.remove()
    }, [])

    const styles = createStyles(themeColor)
    const [isScreenReady, setIsScreenReady] = useState(false)
    const [isAlertSoundEnabled, setIsAlertSoundEnabled] = useState(false)
    const [isAlertVibrationEnabled, setIsAlertVibrationEnabled] =
        useState(false)

    useEffect(() => {
        const setAlertParameters = async () => {
            setIsAlertSoundEnabled(
                (await getAlertSoundEnabled()) == 'true' ? true : false,
            )
            setIsAlertVibrationEnabled(
                (await getAlertVibrationEnabled()) == 'true' ? true : false,
            )
            setIsScreenReady(true)
        }

        setAlertParameters()
    }, [])

    if (!isScreenReady)
        return (
            <View
                style={{
                    backgroundColor: themeColor.BG,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <ActivityIndicator
                    size='large'
                    color={
                        themeColor === lightColors
                            ? baseColors.SCHOOL_BG
                            : baseColors.GRAY_2
                    }
                />
            </View>
        )

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View>
                    <Text style={styles.subjectLabel}>알림 설정</Text>
                    <TouchableOpacity style={styles.contextContainer}>
                        <Text style={styles.contextLabel}>알림 수신 설정</Text>
                    </TouchableOpacity>
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
                            소리
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
                                    isAlertSoundEnabled
                                        ? baseColors.SCHOOL_BG
                                        : themeColor === lightColors
                                        ? baseColors.WHITE
                                        : baseColors.GRAY_2
                                }
                                value={isAlertSoundEnabled}
                                onValueChange={() => {
                                    setIsAlertSoundEnabled(!isAlertSoundEnabled)
                                    setAlertSoundEnabled(!isAlertSoundEnabled)
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.contextContainer}>
                        <Text style={styles.contextLabel}>진동</Text>
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
                                    isAlertVibrationEnabled
                                        ? baseColors.SCHOOL_BG
                                        : themeColor === lightColors
                                        ? baseColors.WHITE
                                        : baseColors.GRAY_2
                                }
                                value={isAlertVibrationEnabled}
                                onValueChange={() => {
                                    setIsAlertVibrationEnabled(
                                        !isAlertVibrationEnabled,
                                    )
                                    setAlertVibrationEnabled(
                                        !isAlertVibrationEnabled,
                                    )
                                }}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.line} />
                <View>
                    <Text style={styles.subjectLabel}>기타</Text>
                    <TouchableOpacity style={styles.contextContainer}>
                        <Text style={styles.contextLabel}>공지사항</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contextContainer}>
                        <Text style={styles.contextLabel}>개발자 문의</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contextContainer}>
                        <Text style={styles.contextLabel}>업데이트 확인</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.line} />
                <View>
                    <TouchableOpacity
                        style={styles.contextContainer}
                        onPress={onLogOut}>
                        <Text style={styles.contextLabel}>로그아웃</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contextContainer}>
                        <Text style={styles.contextLabel}>회원탈퇴</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.BG,
            paddingHorizontal: 16,
            paddingTop: 8,
        },
        backButtonImage: {
            width: 24,
            height: 24,
        },
        scrollView: { flex: 1, marginTop: 16 },
        subjectLabel: {
            color: theme.TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic-Bold',
            paddingVertical: 8,
        },
        contextContainer: {
            padding: 16,
        },
        contextLabel: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic',
        },
        line: {
            borderBottomWidth: 1,
            borderBottomColor: baseColors.GRAY_2,
            marginTop: 20,
            marginBottom: 20,
        },
        switch: {
            position: 'absolute',
            right: -12,
        },
    })

export default Setting

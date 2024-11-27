import { delProfile } from '@/apis/profileService'
import Dialog from '@/components/Dialog'
import { baseColors, Icolor, lightColors } from '@/constants/colors'
import { queryGetMemberInfo } from '@/hooks/useQuery/profileQuery'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import {
    getGlobalAlertSoundEnabled,
    getGlobalAlertVibrationEnabled,
    setGlobalAlertSoundEnabled,
    setGlobalAlertVibrationEnabled,
} from '@/utils/asyncStorageUtils'
import { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import { getAnnouncPostList } from '@/apis/boardService'

const CIRCLE_SIZE = 30
const CIRCLE_RING_SIZE = 2

const Setting: React.FC = (): React.JSX.Element => {
    const { themeColor, onLogOut } = useBoundStore(state => ({
        themeColor: state.themeColor,
        onLogOut: state.onLogOut,
    }))

    const styles = createStyles(themeColor)
    const [isScreenReady, setIsScreenReady] = useState(false)
    const [isAlertSoundEnabled, setIsAlertSoundEnabled] = useState(false)
    const [isAlertVibrationEnabled, setIsAlertVibrationEnabled] =
        useState(false)

    const navigation = stackNavigation()

    const colorList = ['#002c62', '#8b0029', '#036B3F', '#e17100']
    const [colorValue, setColorValue] = useState(0)

    const [logoutVisible, setLogoutVisible] = useState(false)
    const openLogout = () => {
        setLogoutVisible(true)
    }
    const closeLogout = () => {
        setLogoutVisible(false)
    }
    const [delIDVisible, setDelIDVisible] = useState(false)
    const openDelID = () => {
        setDelIDVisible(true)
    }
    const closeDelID = () => {
        setDelIDVisible(false)
    }
    const [countDelID, setCountDelID] = useState(3)
    const delIDButtonText = (countDelID: any) => {
        return `회원탈퇴 (${countDelID}회 터치)`
    }

    const { data, isLoading, error } = queryGetMemberInfo()

    const authCompletedText = (school: any) => {
        if (school == 'null')
            return (
                <View>
                    <Text
                        style={{
                            ...styles.contextLabel,
                            paddingHorizontal: 5,
                            color: 'red',
                        }}>
                        미완료
                    </Text>
                </View>
            )
        else
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Text
                        style={{
                            ...styles.contextLabel,
                            paddingHorizontal: 5,
                            color: 'dodgerblue',
                        }}>{`완료 (${school})`}</Text>
                </View>
            )
    }

    const delAccount = async () => {
        delProfile()
            .then(res => {
                onLogOut(false)
                Toast.show({ text1: '계정이 삭제되었습니다.' })
            })
            .catch(err => {
                console.log('delAccount: ', err)
            })
    }

    const goAnnouncList = async () => {
        getAnnouncPostList()
            .then(res => {
                navigation.navigate('AnnouncementList', res)
            })
            .catch(err => {
                console.log('getAnnouncPostList: ', err)
            })
    }

    useEffect(() => {
        const setAlertParameters = async () => {
            setIsAlertSoundEnabled(await getGlobalAlertSoundEnabled())
            setIsAlertVibrationEnabled(await getGlobalAlertVibrationEnabled())
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
                    <Text style={styles.subjectLabel}>계정</Text>
                    <View
                        style={{
                            ...styles.authContainer,
                            backgroundColor:
                                data?.university == 'null'
                                    ? 'rgba(255, 0, 0, 0.2)'
                                    : themeColor.BG,
                        }}>
                        <TouchableOpacity
                            style={{
                                ...styles.contextContainer,
                                flexDirection: 'row',
                            }}
                            onPress={() => navigation.navigate('SchoolAuth1')}>
                            <Text style={styles.contextLabel}>학교 인증</Text>
                            {authCompletedText(data?.university)}
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.contextContainer}
                        onPress={() => navigation.navigate('ChangePw')}>
                        <Text style={styles.contextLabel}>비밀번호 변경</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.contextContainer}
                        onPress={openLogout}>
                        <Text style={styles.contextLabel}>로그아웃</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.contextContainer}
                        onPress={openDelID}>
                        <Text
                            style={[
                                styles.contextLabel,
                                {
                                    color: baseColors.RED,
                                    fontFamily: 'NanumGothic-Bold',
                                },
                            ]}>
                            회원탈퇴
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.line} />
                    <Text style={styles.subjectLabel}>알림 설정</Text>
                    <TouchableOpacity
                        style={styles.contextContainer}
                        onPress={() => navigation.navigate('AlertSetting')}>
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
                                trackColor={{
                                    false: baseColors.GRAY_3,
                                    true: baseColors.SCHOOL_BG_LIGHT,
                                }}
                                thumbColor={
                                    isAlertSoundEnabled
                                        ? baseColors.SCHOOL_BG
                                        : themeColor === lightColors
                                        ? baseColors.WHITE
                                        : baseColors.GRAY_2
                                }
                                value={isAlertSoundEnabled}
                                onValueChange={() => {
                                    setGlobalAlertSoundEnabled(
                                        !isAlertSoundEnabled,
                                    )
                                    setIsAlertSoundEnabled(!isAlertSoundEnabled)
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
                                    setGlobalAlertVibrationEnabled(
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
                    <TouchableOpacity
                        style={styles.contextContainer}
                        onPress={goAnnouncList}>
                        <Text style={styles.contextLabel}>공지사항</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.contextContainer}
                        onPress={() => navigation.navigate('Support')}>
                        <Text style={styles.contextLabel}>개발자 문의</Text>
                    </TouchableOpacity>
                    {/*
                    <TouchableOpacity
                        style={styles.contextContainer}
                        onPress={() => navigation.navigate('VersionCheck')}>
                        <Text style={styles.contextLabel}>버전 정보</Text>
                    </TouchableOpacity> */}
                </View>
            </ScrollView>
            <Dialog
                enabled={logoutVisible}
                title='로그아웃'
                content={`로그아웃 하시겠습니까?`}
                theme={themeColor}
                onClose={() => setLogoutVisible(false)}
                containerStyle={{ width: 280 }}
                buttonsAlign='horizontal'
                buttons={[
                    {
                        text: '로그아웃',
                        style: 'primary',
                        onPress: () => {
                            setLogoutVisible(false)
                            onLogOut(false)
                        },
                    },
                    {
                        text: '취소',
                        style: 'secondary',
                        onPress: () => {
                            setLogoutVisible(false)
                        },
                    },
                ]}
            />
            <Dialog
                enabled={delIDVisible}
                title='회원탈퇴'
                content={`정말 회원탈퇴 하시겠습니까?\n모든 회원 정보가 삭제됩니다.`}
                theme={themeColor}
                onClose={() => setDelIDVisible(false)}
                containerStyle={{ width: 280 }}
                buttonsAlign='vertical'
                buttons={[
                    {
                        text: delIDButtonText(countDelID),
                        style: 'destructive',
                        onPress: () => {
                            setCountDelID(countDelID => countDelID - 1)
                            if (countDelID == 1) {
                                delAccount()
                                closeDelID()
                                setCountDelID(3)
                            }
                        },
                    },
                    {
                        text: '취소',
                        style: 'secondary',
                        onPress: () => {
                            setDelIDVisible(false)
                        },
                    },
                ]}
            />
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.BG,
            paddingTop: 8,
        },
        authContainer: {
            flex: 1,
            borderRadius: 8,
        },
        backButtonImage: {
            width: 24,
            height: 24,
        },
        scrollView: { flex: 1, marginTop: 16, paddingHorizontal: 16 },
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
        colorGroup: {
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
        },
        circle: {
            width: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
            height: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
            borderRadius: 9999,
            backgroundColor: theme.BG,
            borderWidth: CIRCLE_RING_SIZE,
            borderColor: 'transparent',
            marginRight: 5,
        },
        circleInside: {
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: 9999,
            position: 'absolute',
            top: CIRCLE_RING_SIZE,
            left: CIRCLE_RING_SIZE,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            padding: 25,
            backgroundColor: theme.BG,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            width: '80%',
            borderWidth: 0.5,
            borderColor: theme.TEXT,
        },
        confirmButton: {
            marginTop: 10,
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            height: 30,
            width: '50%',
            borderRadius: 8,
        },
        cancelButton: {
            marginTop: 10,
            backgroundColor: theme.BG,
            justifyContent: 'center',
            alignItems: 'center',
            height: 30,
            width: '50%',
            borderRadius: 8,
        },
    })

export default Setting

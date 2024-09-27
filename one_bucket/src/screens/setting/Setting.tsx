import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import {
    getAlertSoundEnabled,
    getAlertVibrationEnabled,
    setAlertSoundEnabled,
    setAlertVibrationEnabled,
} from '@/utils/asyncStorageUtils'
import { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Appearance,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import { queryGetMemberInfo } from '@/hooks/useQuery/profileQuery'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'

const CIRCLE_SIZE = 30
const CIRCLE_RING_SIZE = 2

interface SettingProps {
    onValueChange: (value: number) => void;
}

const Setting: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor, onLogOut } = useBoundStore(state => ({
        themeColor: state.themeColor,
        setThemeColor: state.setThemeColor,
        onLogOut: state.onLogOut,
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

    const styles = createStyles(themeColor)
    const [isScreenReady, setIsScreenReady] = useState(false)
    const [isAlertSoundEnabled, setIsAlertSoundEnabled] = useState(false)
    const [isAlertVibrationEnabled, setIsAlertVibrationEnabled] =
        useState(false)

    const navigation = stackNavigation()
    
    const colorList = ['#002c62', '#8b0029', '#036B3F', '#e17100'];
    const [colorValue, setColorValue] = useState(0)

    const [logoutVisible, setLogoutVisible] = useState(false)
    const openLogout = () => { setLogoutVisible(true); }
    const closeLogout = () => { setLogoutVisible(false); }
    const [delIDVisible, setDelIDVisible] = useState(false)
    const openDelID = () => { setDelIDVisible(true); }
    const closeDelID = () => { setDelIDVisible(false); }

    const authCompletedText = (school: string) => {
        if(school == 'null') return (
            <View>
                <Text style={{
                    ...styles.contextLabel,
                    paddingHorizontal: 10,
                    color: 'red',
                }}>미완료</Text>
            </View>
        )
        else return (
            <View style={{flexDirection: "row"}}>
                <Text style={{
                    ...styles.contextLabel,
                    paddingHorizontal: 10,
                    color: 'dodgerblue',
                }}>완료</Text>
                <Text style={styles.contextLabel}>{'('+school+')'}</Text>
            </View>
        )
    }

    const { data, isLoading, error } = queryGetMemberInfo()
    const [memberInfo, profileImage] = data ? data : [null, null]

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
                    <View style={{...styles.authContainer,
                        backgroundColor: (memberInfo!.university == 'null') ? 
                        "rgba(255, 0, 0, 0.2)" : themeColor.BG
                    }}>
                        <TouchableOpacity 
                            style={{...styles.contextContainer, flexDirection: "row"}}
                            onPress={() => navigation.navigate('SchoolAuth1')}
                        >
                            <Text style={styles.contextLabel}>학교 인증</Text>
                            {authCompletedText(memberInfo!.university)}
                        </TouchableOpacity>
                        {/*
                        <TouchableOpacity 
                            style={{...styles.contextContainer, flexDirection: "row"}}
                            onPress={() => {
                                setPhoneIsAuth(true)
                                navigation.navigate('PhoneAuth1')
                            }}>
                            <Text style={styles.contextLabel}>휴대폰 인증</Text>
                            {authCompletedText(phoneIsAuth)}
                        </TouchableOpacity>
                        */}
                    </View>
                    <View style={styles.line} />
                    <Text style={styles.subjectLabel}>알림 설정</Text>
                    <TouchableOpacity 
                        style={styles.contextContainer}
                        onPress={() => navigation.navigate('AlertSetting')}    
                        >
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
                        테마 색상 변경
                    </Text>
                    <View style={styles.colorGroup}>
                        {colorList.map((item, index) => {
                            const isActive = colorValue === index
                            return (
                                <View key={item}>
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            setColorValue(index)
                                        }}>
                                        <View
                                            style={[
                                                styles.circle,
                                                isActive && {
                                                    borderColor: item,
                                                },
                                            ]}>
                                            <View
                                                style={[
                                                    styles.circleInside,
                                                    { backgroundColor: item },
                                                ]}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                
                            )
                        })}
                    </View>
                </View>
                <View style={styles.line} />
                <View>
                    <Text style={styles.subjectLabel}>기타</Text>
                    <TouchableOpacity 
                        style={styles.contextContainer}
                        onPress={() => navigation.navigate('Announcement')}    
                        >
                        <Text style={styles.contextLabel}>공지사항</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.contextContainer}
                        onPress={() => navigation.navigate('Support')}    
                        >
                        <Text style={styles.contextLabel}>개발자 문의</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.contextContainer}
                        onPress={() => navigation.navigate('VersionCheck')}    
                        >
                        <Text style={styles.contextLabel}>버전 정보</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.line} />
                <View>
                    <TouchableOpacity
                        style={styles.contextContainer}
                        onPress={openLogout}>
                        <Text style={styles.contextLabel}>로그아웃</Text>
                    </TouchableOpacity>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={logoutVisible}
                        onRequestClose={closeLogout}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text>정말 로그아웃 하시겠습니까?</Text>
                                <View style={{flexDirection: "row"}}>
                                    <TouchableOpacity style={styles.confirmButton} onPress={onLogOut}>
                                        <Text>예</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.cancelButton} onPress={closeLogout}>
                                        <Text>아니오</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity 
                        style={styles.contextContainer}
                        onPress={openDelID}>
                        <Text
                            style={[
                                styles.contextLabel,
                                { color: baseColors.RED },
                            ]}>
                            회원탈퇴
                        </Text>
                    </TouchableOpacity>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={delIDVisible}
                        onRequestClose={closeDelID}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={{color: baseColors.RED}}>정말 회원탈퇴 하시겠습니까?</Text>
                                <View style={{flexDirection: "row"}}>
                                    <TouchableOpacity style={styles.confirmButton} onPress={closeDelID}>
                                        <Text>예</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.cancelButton} onPress={closeDelID}>
                                        <Text>아니오</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
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
        authContainer: {
            flex: 1,
            paddingHorizontal: 8,
            borderRadius: 8,
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
            padding: 20,
            backgroundColor: theme.BG,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            width: '80%',
            borderWidth: 0.5,
            borderColor: theme.TEXT
        },
        confirmButton: {
            marginTop: 10,
            backgroundColor : "rgba(255, 0, 0, 0.2)",
            justifyContent: 'center',
            alignItems: 'center',
            height: 30,
            width: '50%',
            borderRadius: 8,
            
        },
        cancelButton:{
            marginTop: 10,
            backgroundColor: theme.BG,
            justifyContent: 'center',
            alignItems: 'center',
            height: 30,
            width: '50%',
            borderRadius: 8,
        }
    })

export default Setting

import IcAngleRight from '@/assets/drawable/ic-angle-right.svg'
import IcArrowCircle from '@/assets/drawable/ic-arrow-circle.svg'
import IcPlus from '@/assets/drawable/ic-plus.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import {
    queryGetMemberInfo,
    queryGetProfile,
} from '@/hooks/useQuery/profileQuery'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import React, { useEffect, useState } from 'react'
import {
    Alert,
    ActivityIndicator,
    Appearance,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import { stackNavigation } from './navigation/NativeStackNavigation'
import { delProfile } from '@/apis/profileService'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const Mypage = (): React.JSX.Element => {
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

    // const [nickName, setNickName] = useState('')

    const { data, isLoading, error } = queryGetMemberInfo()
    // const [memberInfo, profileImage] = data ? data : [null, null]
    const [goAuthVisible, setGoAuthVisible] = useState(false)
    const openGoAuth = () => { setGoAuthVisible(true); }
    const closeGoAuth = () => { setGoAuthVisible(false); }

    const [logoutVisible, setLogoutVisible] = useState(false)
    const openLogout = () => { setLogoutVisible(true); }
    const closeLogout = () => { setLogoutVisible(false); }
    const [delIDVisible, setDelIDVisible] = useState(false)
    const openDelID = () => { setDelIDVisible(true); }
    const closeDelID = () => { setDelIDVisible(false); }
    const [countDelID, setCountDelID] = useState(3);

    const authCompletedText = (school: any) => {
        if(school == 'null') return (
            <View>
                <Text style={{
                    ...styles.contextLabel,
                    paddingHorizontal: 5,
                    color: 'red',
                }}>미완료</Text>
            </View>
        )
        else return (
            <View style={{flexDirection: "row"}}>
                <Text style={{
                    ...styles.contextLabel,
                    paddingHorizontal: 5,
                    color: 'dodgerblue',
                }}>{`완료 (${school})`}</Text>
            </View>
        )
    }

    const delAccount = async () => {
        if(data?.nickname=='test1') {
            Alert.alert('관리자 계정은 삭제할 수 없습니다.')
            return
        } // 공용계정 삭제 방지
        delProfile()
            .then(res=>{
                onLogOut(false)
                Toast.show({ text1: '계정이 삭제되었습니다.' })
            })
            .catch(err=>{
                console.log('delAccount: ',err)
            })
    }

    const navigation = stackNavigation()

    const handleProfileDetailNavigation = () => {
        navigation.navigate('ProfileDetails')
    }

    if (error) return <Text>error</Text>

    if (isLoading)
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
            <View style={styles.profileContainer}>
                <View style={styles.profileTextContainer}>
                    {/* <CachedImage
                        imageStyle={{}}
                        image={data![1]}
                        imageId='profile2'
                    /> */}
                    <Text style={styles.username}>{data?.nickname}</Text>
                    <Text style={styles.userInfo}>거래 6건</Text>
                </View>
                <TouchableOpacity 
                    style={styles.profileButton}
                    /*
                    onPress={()=>{
                        if(data?.university == 'null') {openGoAuth()}
                        else {handleProfileDetailNavigation()}
                    }}> */
                     onPress={handleProfileDetailNavigation}>
                    <Text style={styles.profileLink}>프로필 보기</Text>
                </TouchableOpacity>
                <Modal
                        animationType="slide"
                        transparent={true}
                        visible={goAuthVisible}
                        onRequestClose={closeGoAuth}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text>{`프로필 조회를 위해 먼저 학교 인증을 실시해 주세요.\n`}</Text>
                                <View style={{flexDirection: "row"}}>
                                    <TouchableOpacity 
                                        style={{...styles.confirmButton, backgroundColor: "rgba(0, 120, 255, 0.2)"}} 
                                        onPress={()=>{
                                            closeGoAuth()
                                            navigation.navigate('SchoolAuth1')
                                        }}>
                                        <Text>바로가기</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.cancelButton} onPress={closeGoAuth}>
                                        <Text>닫기</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                </Modal>
            </View>
            <View style={styles.activityContainer}>
                <Text style={styles.activityTitle}>나의 활동</Text>
                <TouchableOpacity style={styles.activityItem}>
                    {/* <Icon name='favorite' size={24} color='black' /> */}
                    <Text style={styles.activityText}>좋아요 누른 글</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.activityItem}>
                    {/* <Icon name='description' size={24} color='black' /> */}
                    <Text style={styles.activityText}>내가 쓴 글</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.BG,
            flex: 1,
        },
        container_account: {
            flex: 1,
            backgroundColor: theme.BG,
            paddingHorizontal: 16,
            paddingTop: 8,
        },
        scrollView: { flex: 1, marginTop: 16 },
        header: {
            backgroundColor: baseColors.SCHOOL_BG,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
        },
        headerTitle: {
            color: theme.TEXT,
            fontSize: 18,
            fontWeight: 'bold',
        },
        profileContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
        },
        profileImage: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: baseColors.GRAY_2,
        },
        profileTextContainer: {
            flex: 1,
            marginLeft: 16,
        },
        username: {
            color: theme.TEXT,
            fontSize: 18,
            fontFamily: 'NanumGothic',
            marginBottom: 8,
        },
        userInfo: {
            color: theme.TEXT_SECONDARY,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
        profileButton: {
            borderColor: theme.TEXT_SECONDARY,
            borderRadius: 6,
            borderWidth: 1,
            padding: 8,
            marginTop: 12,
        },
        profileLink: {
            color: theme.TEXT_SECONDARY,
            fontFamily: 'NanumGothic',
            fontSize: 14,
        },
        payMoneyContainer: {
            backgroundColor: theme.BG,
            borderColor: theme === lightColors ? '' : baseColors.GRAY_2,
            borderWidth: theme === lightColors ? 0 : 1,
            padding: 10,
            marginHorizontal: 16,
            borderRadius: 8,
            elevation: 3,
        },
        payMoneyTextContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 8,
            marginBottom: 16,
        },
        payMoneyLabel: {
            color: theme.TEXT,
            flex: 1,
            fontSize: 16,
            fontFamily: 'NanumGothic',
        },
        payMoneyAmount: {
            color: theme.TEXT,
            flex: 1,
            fontSize: 16,
            fontFamily: 'NanumGothic',
        },
        payMoneyDetailsButton: {
            flex: 1,
            alignItems: 'flex-end',
            width: 20,
            height: 20,
        },
        payMoneyButtonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
        },
        payMoneyButton: {
            backgroundColor:
                theme === lightColors
                    ? baseColors.SCHOOL_BG
                    : baseColors.GRAY_0,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            paddingVertical: 10,
            marginHorizontal: 4,
        },
        payMoneyButtonImage: {
            height: 16,
            width: 16,
            marginEnd: 4,
        },
        payMoneyButtonText: {
            color: theme.BUTTON_TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic',
            marginEnd: 6,
        },
        activityContainer: {
            backgroundColor: theme.BG,
            borderColor:
                theme === lightColors
                    ? baseColors.SCHOOL_BG
                    : baseColors.GRAY_2,
            padding: 16,
            marginHorizontal: 16,
            borderRadius: 8,
            marginTop: 16,
            borderWidth: 1,
        },
        activityTitle: {
            color:
                theme === lightColors
                    ? baseColors.SCHOOL_BG
                    : theme.TEXT_SECONDARY,
            fontSize: 16,
            fontFamily: 'NanumGothic-Bold',
            marginBottom: 8,
        },
        activityItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
        },
        activityText: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic',
            marginLeft: 8,
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
        },
        authContainer: {
            flex: 1,
            borderRadius: 8,
        },
        contextContainer: {
            padding: 16,
        },
        contextLabel: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic',
        },
    })

export default Mypage

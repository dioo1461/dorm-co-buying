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
    ActivityIndicator,
    Appearance,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { stackNavigation } from './navigation/NativeStackNavigation'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const Mypage = (): React.JSX.Element => {
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

    const styles = createStyles(themeColor)

    // const [nickName, setNickName] = useState('')

    const { data, isLoading, error } = queryGetMemberInfo()
    // const [memberInfo, profileImage] = data ? data : [null, null]
    const [goAuthVisible, setGoAuthVisible] = useState(false)
    const openGoAuth = () => { setGoAuthVisible(true); }
    const closeGoAuth = () => { setGoAuthVisible(false); }

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
                    <Text style={styles.userInfo}>거래 6건 · 친구 4명</Text>
                </View>
                <TouchableOpacity 
                    onPress={()=>{
                        if(data?.university == 'null') {openGoAuth()}
                        else {handleProfileDetailNavigation()}
                    }}>
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
                                    <TouchableOpacity style={styles.confirmButton} onPress={()=>{navigation.navigate('SchoolAuth1')}}>
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
            <View style={styles.payMoneyContainer}>
                <View style={styles.payMoneyTextContainer}>
                    <Text style={styles.payMoneyLabel}>페이머니</Text>
                    <Text style={styles.payMoneyAmount}>12,000</Text>
                    <TouchableOpacity style={styles.payMoneyDetailsButton}>
                        <IcAngleRight fill={baseColors.GRAY_3} />
                    </TouchableOpacity>
                </View>
                <View style={styles.payMoneyButtonsContainer}>
                    <TouchableOpacity style={styles.payMoneyButton}>
                        <IcPlus style={styles.payMoneyButtonImage} />
                        <Text style={styles.payMoneyButtonText}>충전</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.payMoneyButton}>
                        <IcArrowCircle style={styles.payMoneyButtonImage} />
                        <Text style={styles.payMoneyButtonText}>반환</Text>
                    </TouchableOpacity>
                </View>
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
            backgroundColor : "rgba(0, 0, 255, 0.2)",
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
    })

export default Mypage

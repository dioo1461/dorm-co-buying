import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import { baseColors, Icolor, lightColors } from '@/constants/colors'
import { Gender } from '@/data/response/success/auth/GetProfileResponse'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import BasicProfileImage from '@/assets/drawable/basic-profile-image.svg'
import { CachedImage } from '@/components/CachedImage'
import ProfileImage from '@/components/ProfileImage'

const ProfileDetails: React.FC = (): React.JSX.Element => {
    const { themeColor, memberInfo, profile } = useBoundStore(state => ({
        themeColor: state.themeColor,
        memberInfo: state.memberInfo,
        profile: state.profile,
    }))

    const styles = createStyles(themeColor)

    const navigation = useNavigation()

    const formatDate = (raw: any) => {
        const date = new Date(raw)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 1을 더해줌
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}년 ${month}월 ${day}일`
    }

    const schoolName = (school: string) => {
        if (school == 'null') return '미인증'
        else return school
    }

    const onProfileModifyButtonClick = () => {
        navigation.navigate('ProfileModify')
    }

    return (
        <View style={styles.container}>
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IcAngleLeft
                        style={styles.backButtonImage}
                        fill={baseColors.GRAY_2}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.headerContainer}>
                <View style={styles.profileImageContainer}>
                    <ProfileImage
                        imageUrl={profile?.imageUrl}
                        theme={themeColor}
                        width={112}
                        height={112}
                    />
                    <Text style={styles.nicknameText}>
                        {memberInfo!.nickname}
                    </Text>
                </View>
                <View style={styles.bioContainer}>
                    <Image
                        source={require('@/assets/drawable/postit.png')}
                        style={styles.bioImage}
                    />
                    <ScrollView
                        style={styles.bioTextScrollView}
                        showsVerticalScrollIndicator={false}>
                        <Text style={styles.bioText}>
                            {profile!.description}
                        </Text>
                    </ScrollView>
                </View>
            </View>
            <View style={styles.profilesContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <Text style={styles.profileLabel}>이름</Text>
                        <Text style={styles.profileContext}>
                            {profile!.name}
                        </Text>
                        <Text style={styles.profileLabel}>성별</Text>
                        <Text style={styles.profileContext}>
                            {Gender[profile!.gender]}
                        </Text>
                        <Text style={styles.profileLabel}>생년월일</Text>
                        <Text style={styles.profileContext}>
                            {formatDate(profile!.birth)}
                        </Text>
                        <Text style={styles.profileLabel}>학교명</Text>
                        <Text style={styles.profileContext}>
                            {schoolName(memberInfo!.university)}
                        </Text>
                        {/*
                        <Text style={styles.profileLabel}>학부</Text>
                        <Text style={styles.profileContext}>
                            컴붕
                        </Text>
                        */}
                        <Text style={styles.profileLabel}>가입한 날짜</Text>
                        <Text style={styles.profileContext}>
                            {formatDate(profile!.createAt)}
                        </Text>
                    </View>
                </ScrollView>
            </View>
            <View style={styles.profileModifyButtonContainer}>
                <TouchableOpacity
                    style={styles.profileModifyButton}
                    onPress={onProfileModifyButtonClick}>
                    <Text style={styles.profileModifyButtonText}>
                        프로필 수정
                    </Text>
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
            paddingHorizontal: 16,
            paddingTop: 20,
        },
        backButtonContainer: {
            flex: 1,
            marginTop: 10,
        },
        backButtonImage: {
            width: 24,
            height: 24,
        },
        headerContainer: {
            flex: 3,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
        },
        profileImageContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        nicknameText: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic-Bold',
            fontSize: 18,
            marginTop: 16,
        },
        bioContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        bioImage: {
            width: 159,
            height: 192,
        },
        bioTextScrollView: {
            position: 'absolute',
            top: 4,
            left: 16,
            width: '80%',
            height: '100%',
        },
        bioText: {
            // color: theme.TEXT,
            color: 'black',
            fontFamily: 'NanumGothic',
            fontSize: 14,
            paddingLeft: 10,
        },
        profilesContainer: {
            backgroundColor: theme.BG,
            borderWidth: theme === lightColors ? 0 : 1,
            borderColor: theme === lightColors ? '' : baseColors.GRAY_2,
            flex: 8,
            padding: 10,
            marginHorizontal: 16,
            borderRadius: 8,
            elevation: 3,
        },
        profileLabel: {
            color: theme.TEXT_SECONDARY,
            fontSize: 14,
            fontFamily: 'NanumGothic',
            marginTop: 10,
        },
        profileContext: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic-Bold',
            marginTop: 10,
            marginBottom: 16,
            marginStart: 12,
        },
        profileModifyButtonContainer: {
            flex: 2,
            justifyContent: 'center',
        },
        profileModifyButton: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: baseColors.SCHOOL_BG,
            borderRadius: 8,
            paddingVertical: 16,
            marginHorizontal: 4,
        },
        profileModifyButtonText: {
            color: theme.BUTTON_TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic',
            marginEnd: 6,
        },
    })

export default ProfileDetails

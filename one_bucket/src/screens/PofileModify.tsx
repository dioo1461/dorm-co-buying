import { postProfile } from '@/apis/profileService'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { AddProfileRequestBody } from '@/data/request/AddProfileRequestBody'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createSignUpStyles } from '@/styles/signUp/signUpStyles'
import { StringFilter } from '@/utils/StringFilter'
import CheckBox from '@react-native-community/checkbox'
import React, { useEffect, useState } from 'react'
import {
    Appearance,
    BackHandler,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import IcArrowLeft from '@/assets/drawable/ic-arrow-left.svg'
import Toast from 'react-native-toast-message'

const ProfileDetails: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor, memberInfo, profile } = useBoundStore(
        state => ({
            themeColor: state.themeColor,
            setThemeColor: state.setThemeColor,
            memberInfo: state.memberInfo,
            profile: state.profile,
        }),
    )

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
    const signUpStyles = createSignUpStyles(themeColor)

    const navigation = stackNavigation()

    const getYear = (raw: any) => {
        const date = new Date(raw)
        const year = String(date.getFullYear())
        return year
    }
    const getMonth = (raw: any) => {
        const date = new Date(raw)
        const month = String(date.getMonth() + 1).padStart(2, '0')
        return month
    }
    const getDay = (raw: any) => {
        const date = new Date(raw)
        const day = String(date.getDate()).padStart(2, '0')
        return day
    }
    const getGender = (gender: any) => {
        if(gender == 'man') return true
        else return false
    }

    const [name, setName] = useState(profile!.name)
    const [male, setMale] = useState(getGender(profile!.gender))
    const gender = (male == true) ? 'man' : 'woman'
    const [year, setYear] = useState(getYear(profile!.birth))
    const [month, setMonth] = useState(getMonth(profile!.birth))
    const [day, setDay] = useState(getDay(profile!.birth))
    const [age, setAge] = useState(0)
    const birth = String(year + '-' + String(month).padStart(2,"0") + '-' + String(day).padStart(2,"0"))
    const [bio, setBio] = useState(String(profile!.description))

    const handleNameChange = (text: string) => {
        const cleaned = StringFilter.sqlFilter(text)
        setName(cleaned)
    }

    const handleSubmit = async () => {
        // const result = await submitSignupForm(signUpForm)
        const form: AddProfileRequestBody = {
            name: name,
            gender: gender,
            age: age,
            description: bio,
            birth: birth,
        }
        postProfile(form)
            .then(res => {
                Toast.show({ text1: '프로필이 성공적으로 수정되었습니다.' })
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
            <View style={signUpStyles.container}>
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack()
                        }}
                        style={signUpStyles.backButton}>
                        <IcArrowLeft />
                    </TouchableOpacity>
                </View>
                <View style={styles.verificationContainer}>
                        <Text style={styles.infoText}>
                            입력했던 프로필을 수정할 수 있습니다.
                        </Text>
                    </View>
                <ScrollView>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.label}>이름</Text>
                        <Text style={styles.accent}>*</Text>
                    </View>
                    <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder='이름'
                            placeholderTextColor={themeColor.TEXT_SECONDARY}
                        />
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.label}>성별</Text>
                        <Text style={styles.accent}>*</Text>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity
                            onPress={() => setMale(true)}
                            style={styles.dormContainer}>
                            <CheckBox
                                disabled={false}
                                value={male}
                                onValueChange={newVal => setMale(newVal)}
                                tintColors={{
                                    true: baseColors.SCHOOL_BG,
                                    false: baseColors.GRAY_1,
                                }}
                            />
                            <Text style={styles.dormText}>
                                남성
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setMale(false)}
                            style={styles.dormContainer}>
                            <CheckBox
                                disabled={false}
                                value={!male}
                                onValueChange={newVal => setMale(!newVal)}
                                tintColors={{
                                    true: baseColors.SCHOOL_BG,
                                    false: baseColors.GRAY_1,
                                }}
                            />
                            <Text style={styles.dormText}>
                                여성
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.label}>생년월일</Text>
                        <Text style={styles.accent}>*</Text>
                    </View>
                    <View style={{flexDirection:"row", alignItems: 'center'}}>
                        <TextInput
                                style={styles.birthInput}
                                value={year}
                                onChangeText={setYear}
                                placeholder='YYYY'
                                keyboardType='number-pad'
                                textAlign='center'
                                placeholderTextColor={themeColor.TEXT_SECONDARY}
                            />
                        <Text style={{fontSize: 16, marginBottom: 16}}> 년  </Text>
                        <TextInput
                                style={styles.birthInput}
                                value={month}
                                onChangeText={setMonth}
                                placeholder='MM'
                                keyboardType='number-pad'
                                textAlign='center'
                                placeholderTextColor={themeColor.TEXT_SECONDARY}
                            />
                        <Text style={{fontSize: 16, marginBottom: 16}}> 월  </Text>
                        <TextInput
                                style={styles.birthInput}
                                value={day}
                                onChangeText={setDay}
                                placeholder='DD'
                                keyboardType='number-pad'
                                textAlign='center'
                                placeholderTextColor={themeColor.TEXT_SECONDARY}
                            />
                        <Text style={{fontSize: 16, marginBottom: 16}}> 일 </Text>
                    </View>
                    <Text style={styles.label}>자기소개</Text>
                    <TextInput
                        style={styles.bioInput}
                        value={bio}
                        onChangeText={setBio}
                        placeholder='간단한 자기소개를 작성해 주세요.'
                        keyboardType='default'
                        multiline={true}
                        numberOfLines={3}
                    />
                    <TouchableOpacity
                        style={{...styles.button,
                            backgroundColor: !name
                                ? baseColors.GRAY_2
                                : baseColors.SCHOOL_BG, 
                        }}
                        disabled={ !name || !year || !month || !day }
                        onPress={handleSubmit}>
                        <Text style={styles.buttonText}>수정하기</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        infoText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
        verificationContainer: {
            marginVertical: 20,
            alignItems: 'center',
        },
        label: {
            color: theme.TEXT,
            fontSize: 18,
            fontFamily: 'NanumGothic-Bold',
            marginTop: 15,
            marginBottom: 10,
        },
        accent: {
            color: theme.ACCENT_TEXT,
            fontSize: 18,
            fontFamily: 'NanumGothic-Bold',
            marginTop: 15,
            marginBottom: 10,
        },
        input: {
            borderBottomWidth: 1,
            paddingBottom: 4,
            borderBottomColor: baseColors.GRAY_1,
            fontSize: 16,
            marginBottom: 20,
        },
        birthInput:{
            width: 50,
            height: 36,
            borderWidth: 1,
            borderRadius: 5,
            paddingBottom: 5,
            borderBottomColor: baseColors.GRAY_1,
            fontSize: 16,
            marginBottom: 20,
        },
        bioInput: {
            borderColor: baseColors.GRAY_1,
            borderWidth: 1,
            borderRadius: 5,
            textAlignVertical: 'top',
            fontSize: 14,
            marginBottom: 10,
        },
        button: {
            backgroundColor: lightColors.BUTTON_BG,
            paddingVertical: 15,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 10,
        },
        buttonText: {
            color: 'white',
            fontSize: 16,
        },
        dormContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            padding: 10,
        },
        dormText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 16,
            marginBottom: 4,
        },
    })

export default ProfileDetails

{/*
import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import {
    queryGetMemberInfo,
    queryGetProfile,
} from '@/hooks/useQuery/profileQuery'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import React, { useEffect } from 'react'
import {
    ActivityIndicator,
    Appearance,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { stackNavigation } from './navigation/NativeStackNavigation'

const ProfileDetails: React.FC = (): React.JSX.Element => {
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
    const navigation = stackNavigation()

    const {
        data: profileData,
        isLoading: isProfileLoading,
        error: profileError,
    } = queryGetProfile()

    const {
        data: memberInfoData,
        isLoading: isMemberInfoLoading,
        error: memberInfoError,
    } = queryGetMemberInfo()

    const formatDate = (raw: any) => {
        const date = new Date(raw)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 1을 더해줌
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}년 ${month}년 ${day}일`
    }
    var formattedCreateDate
    if (profileData) {
        formattedCreateDate = formatDate(profileData.createAt)
    }

    if (profileError || memberInfoError) return <Text>Error...</Text>

    if (isProfileLoading || isMemberInfoLoading)
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <ActivityIndicator size='large' color={baseColors.SCHOOL_BG} />
            </View>
        )

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
            <View>
                <Image
                    source={require('@/assets/drawable/vector.png')}
                    style={styles.profileImage}
                />
            </View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: 20,
            backgroundColor: 'white',
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
        profileImage: {
            backgroundColor: 'black',
            width: 84,
            height: 96,
            borderRadius: 50,
        },
        nicknameText: {
            color: theme.BG,
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
            color: theme.BG,
            fontFamily: 'NanumGothic',
            fontSize: 14,
        },
        profilesContainer: {
            backgroundColor: theme.BG,
            flex: 8,
            padding: 10,
            marginHorizontal: 16,
            borderRadius: 8,
            elevation: 3,
        },
        profileLabel: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic-Bold',
            marginTop: 10,
        },
        profileContext: {
            color: theme.TEXT,
            fontSize: 18,
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
            color: 'white',
            fontSize: 14,
            fontFamily: 'NanumGothic',
            marginEnd: 6,
        },
    })

export default ProfileDetails
*/}
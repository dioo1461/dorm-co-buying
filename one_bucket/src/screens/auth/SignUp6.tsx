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
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import {
    RootStackParamList,
    stackNavigation,
} from '../navigation/NativeStackNavigation'
import { RouteProp, useRoute } from '@react-navigation/native'

const SignUp6: React.FC = (): React.JSX.Element => {
    const { themeColor, onSignUpSuccess } = useBoundStore(state => ({
        themeColor: state.themeColor,
        onSignUpSuccess: state.onSignUpSuccess,
    }))

    type SignUp6RouteProp = RouteProp<RootStackParamList, 'SignUp6'>
    const { params } = useRoute<SignUp6RouteProp>()

    const onPressBackBtn = (action: boolean) => {
        const backAction = (): boolean => {
            if (action) {
                return action
            } else {
                navigation.goBack()
                return action
            }
        }
        BackHandler.addEventListener('hardwareBackPress', backAction)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backAction)
        }
    }

    const styles = createStyles(themeColor)
    const signUpStyles = createSignUpStyles(themeColor)

    const navigation = stackNavigation()

    const [name, setName] = useState('')
    const [male, setMale] = useState(true)
    const [gender, setGender] = useState<'man' | 'woman'>('man')
    const [year, setYear] = useState('')
    const [month, setMonth] = useState('')
    const [day, setDay] = useState('')
    const [age, setAge] = useState(0)
    const birth = String(
        year +
            '-' +
            String(month).padStart(2, '0') +
            '-' +
            String(day).padStart(2, '0'),
    )
    const [bio, setBio] = useState('')

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
                navigation.navigate('SignUp7', {
                    accessToken: params.accessToken,
                })
                onPressBackBtn(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const validateForm = () => {
        // 이름 검사: 최소 2자 이상
        if (!name || name.trim().length < 1) {
            return false
        }

        // 성별 검사: 'man' 또는 'woman'만 허용
        if (gender !== 'man' && gender !== 'woman') {
            return false
        }

        // 생년월일 검사: 연, 월, 일이 숫자이며 형식이 올바른지 확인
        const birthYear = parseInt(year, 10)
        const birthMonth = parseInt(month, 10)
        const birthDay = parseInt(day, 10)

        if (
            !birthYear ||
            birthYear < 1900 ||
            birthYear > new Date().getFullYear()
        ) {
            return false
        }
        if (!birthMonth || birthMonth < 1 || birthMonth > 12) {
            return false
        }
        const birthString = `${year}-${month.padStart(2, '0')}-${day.padStart(
            2,
            '0',
        )}` // YYYY-MM-DD 형식
        const birthDate = new Date(birthString)

        // 날짜 유효성 확인 (잘못된 날짜는 자동으로 무효 처리됨)
        if (
            birthDate.getFullYear() !== parseInt(year) ||
            birthDate.getMonth() + 1 !== parseInt(month) || // getMonth는 0부터 시작
            birthDate.getDate() !== parseInt(day)
        ) {
            return false
        }

        // 자기소개 검사: 최대 200자
        if (bio && bio.length > 200) {
            return false
        }

        // 모든 유효성 검사를 통과하면 true 반환
        return true
    }

    useEffect(() => {
        onSignUpSuccess()
    }, [])

    return (
        <View style={signUpStyles.container}>
            <View style={{ marginTop: 46 }}>
                <Text style={signUpStyles.subStep}>1. 인증 정보 설정</Text>
                <Text style={signUpStyles.currentStep}>
                    2. 프로필 정보 입력
                </Text>
                <Text style={signUpStyles.title}>
                    {`이용자님의 프로필 정보를\n입력해 주세요.`}
                </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'row' }}>
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
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.label}>성별</Text>
                    <Text style={styles.accent}>*</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => setGender('man')}
                        style={styles.dormContainer}>
                        <CheckBox
                            value={gender === 'man'}
                            disabled={false}
                            onValueChange={() => setGender('man')}
                            tintColors={{
                                true: baseColors.SCHOOL_BG,
                                false: baseColors.GRAY_1,
                            }}
                        />
                        <Text style={styles.dormText}>남성</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setGender('woman')}
                        style={styles.dormContainer}>
                        <CheckBox
                            value={gender === 'woman'}
                            disabled={false}
                            onValueChange={() => setGender('woman')}
                            tintColors={{
                                true: baseColors.SCHOOL_BG,
                                false: baseColors.GRAY_1,
                            }}
                        />
                        <Text style={styles.dormText}>여성</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.label}>생년월일</Text>
                    <Text style={styles.accent}>*</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        style={styles.birthInput}
                        value={year}
                        onChangeText={setYear}
                        placeholder='YYYY'
                        keyboardType='number-pad'
                        textAlign='center'
                        placeholderTextColor={themeColor.TEXT_SECONDARY}
                    />
                    <Text style={{ fontSize: 16, marginBottom: 16 }}> 년 </Text>
                    <TextInput
                        style={styles.birthInput}
                        value={month}
                        onChangeText={setMonth}
                        placeholder='MM'
                        keyboardType='number-pad'
                        textAlign='center'
                        placeholderTextColor={themeColor.TEXT_SECONDARY}
                    />
                    <Text style={{ fontSize: 16, marginBottom: 16 }}> 월 </Text>
                    <TextInput
                        style={styles.birthInput}
                        value={day}
                        onChangeText={setDay}
                        placeholder='DD'
                        keyboardType='number-pad'
                        textAlign='center'
                        placeholderTextColor={themeColor.TEXT_SECONDARY}
                    />
                    <Text style={{ fontSize: 16, marginBottom: 16 }}> 일 </Text>
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
                    style={{
                        ...styles.button,
                        backgroundColor: !validateForm()
                            ? baseColors.GRAY_2
                            : baseColors.SCHOOL_BG,
                    }}
                    disabled={!name || !year || !month || !day}
                    onPress={handleSubmit}>
                    <Text style={styles.buttonText}>완료</Text>
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
        birthInput: {
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

export default SignUp6

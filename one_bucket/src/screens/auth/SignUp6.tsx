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
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { stackNavigation } from '../navigation/NativeStackNavigation'

const SignUp6: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor, onSignUpSuccess } = useBoundStore(
        state => ({
            themeColor: state.themeColor,
            setThemeColor: state.setThemeColor,
            onSignUpSuccess: state.onSignUpSuccess,
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

    const [name, setName] = useState('')
    const [male, setMale] = useState(true)
    const gender = (male == true) ? 'man' : 'woman'
    const [year, setYear] = useState('')
    const [month, setMonth] = useState('')
    const [day, setDay] = useState('')
    const [age, setAge] = useState(0)
    const birth = String('1999-'+ String(month).padStart(2,"0") + '-' + String(day).padStart(2,"0"))
    const [bio, setBio] = useState('')
    const [isDormitory, setIsDormitory] = useState(false)

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
                navigation.navigate('SignUp7')
            })
            .catch(err => {
                console.log(err)
            })
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
                <ScrollView>
                    <Text style={styles.label}>이름</Text>
                    <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder='이름'
                            placeholderTextColor={themeColor.TEXT_SECONDARY}
                        />
                    <Text style={styles.label}>성별</Text>
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
                    <Text style={styles.label}>생년월일</Text>
                    <View style={{flexDirection:"row", alignItems: 'center'}}>
                        {/*
                        <TextInput
                                style={styles.birthInput}
                                onChangeText={() => setYear(year)}
                                placeholder='년'
                                placeholderTextColor={themeColor.TEXT_SECONDARY}
                            />
                        <Text style={{fontSize: 20, marginBottom: 10}}> / </Text>
                        */}
                        <TextInput
                                style={styles.birthInput}
                                value={month}
                                onChangeText={setMonth}
                                placeholder='월'
                                placeholderTextColor={themeColor.TEXT_SECONDARY}
                            />
                        <Text style={{fontSize: 16, marginBottom: 16}}> 월 </Text>
                        <TextInput
                                style={styles.birthInput}
                                value={day}
                                onChangeText={setDay}
                                placeholder='일'
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
                        onPress={() => setIsDormitory(!isDormitory)}
                        style={styles.dormContainer}>
                        <CheckBox
                            disabled={false}
                            value={isDormitory}
                            onValueChange={newVal => setIsDormitory(newVal)}
                            tintColors={{
                                true: baseColors.SCHOOL_BG,
                                false: baseColors.GRAY_1,
                            }}
                        />
                        <Text style={styles.dormText}>
                            기숙사에 거주 중이신가요?
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        // onPress={handleSubmit}>
                        onPress={() => navigation.navigate('SignUp7')}>
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
        input: {
            borderBottomWidth: 1,
            paddingBottom: 4,
            borderBottomColor: baseColors.GRAY_1,
            fontSize: 16,
            marginBottom: 20,
        },
        birthInput:{
            width: 75,
            borderBottomWidth: 1,
            paddingBottom: 4,
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

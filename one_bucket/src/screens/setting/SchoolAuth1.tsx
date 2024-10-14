import IcArrowLeft from '@/assets/drawable/ic-arrow-left.svg'
import IcRefresh from '@/assets/drawable/ic-refresh.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createSignUpStyles } from '@/styles/signUp/signUpStyles'
import { StringFilter } from '@/utils/StringFilter'
import React, { useEffect, useState } from 'react'
import {
    Alert,
    Appearance,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import { stackNavigation } from '../navigation/NativeStackNavigation'
import { SchoolAuthRequestBody } from '@/data/request/signUpRequestBody'
import { postSchoolForm } from '@/apis/authService'

const SchoolAuth1: React.FC = (): React.JSX.Element => {
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
    const signUpStyles = createSignUpStyles(themeColor)
    const navigation = stackNavigation()
    const [schoolName, setSchoolName] = useState('')
    const [schoolEmail, setSchoolEmail] = useState('')

    const handleSchoolNameChange = (text: string) => {
        const cleaned = StringFilter.sqlFilter(text)
        setSchoolName(cleaned)
    }

    const handleSchoolEmailChange = (text: string) => {
        const cleaned = StringFilter.sqlFilter(text)
        setSchoolEmail(cleaned)
    }

    const handleSchoolInfoSubmit = () => {
        if (validateInfo(schoolName, schoolEmail) === true) {
            navigation.navigate('SchoolAuth2', {
                schoolName: schoolName,
                schoolEmail: schoolEmail,
            })
        } else {
            Alert.alert('유효한 메일 주소를 입력해주세요.')
        }
    }

    const handleSubmit = async () => {
        if (!validateInfo(schoolName,schoolEmail)) {
            Alert.alert('형식에 맞는 학교 이름 또는 메일 주소를 입력해주세요.')
            return
        }

        const form: SchoolAuthRequestBody = {
            university: schoolName,
            universityEmail: schoolEmail,
        }
        postSchoolForm(form)
            .then(res => {
                navigation.navigate('SchoolAuth2', {
                    schoolName: schoolName,
                    schoolEmail: schoolEmail
                })
            })
            .catch(err => {
                console.log(`SchoolAuth1 - submitSignUpForm: ${err}`)
                {/* if (err.response.status === 409) {
                    if (err.response.data.code == 1000) {
                        setEmailError(
                            signUpErrorMessage.duplicatedEmailOrNickname,
                        )
                        setNicknameError(
                            signUpErrorMessage.duplicatedEmailOrNickname,
                        )
                    }
                } */}
            }   
                )
    }
    
    const validateInfo = (name: string, email: string) => {
        if(!name.endsWith("대학교") || email.indexOf('@') == -1)
            return false
        else return true
    }

    return (
        <ScrollView style={signUpStyles.container}>
            <View>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={signUpStyles.backButton}>
                    <IcArrowLeft />
                </TouchableOpacity>
                <Text style={styles.schoolInfoLabel}>
                    학교 이름 입력
                </Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={handleSchoolNameChange}
                    value={schoolName}
                    placeholder='약칭이 아닌 전체 이름을 입력해 주세요. ex) **대학교'
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                    autoFocus={true}
                />
                <Text style={styles.schoolInfoLabel}>
                    학교 이메일 주소 입력
                </Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={handleSchoolEmailChange}
                    value={schoolEmail}
                    placeholder='ex) B912345@mail.hongik.ac.kr'
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                    keyboardType='email-address'
                    autoFocus={true}
                />
                <TouchableOpacity
                    disabled={
                        !!(
                            !schoolName ||
                            !schoolEmail
                        )
                    }
                    style={[
                        {
                            backgroundColor:
                                !schoolName ||
                                !schoolEmail
                                    ? baseColors.GRAY_2
                                    : baseColors.SCHOOL_BG,
                        },
                    styles.button,
                    ]}
                    onPress={handleSubmit}>
                    {/*
                    onPress = {()=>{navigation.navigate('SchoolAuth2', {
                        schoolName: schoolName,
                        schoolEmail: schoolEmail,
                    })}}> */}
                    <Text style={styles.buttonText}>인증 코드 발송</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        schoolInfoLabel: {
            fontSize: 18,
            color: theme.TEXT,
            fontFamily: 'NanumGothic-Bold',
            alignSelf: 'center',
            marginTop: 30,
            marginBottom: 10,
        },
        textInput: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic',
            borderBottomWidth: 1,
            borderBottomColor: 'gray',
            paddingBottom: 4,
            marginBottom: 30,
        },
        button: {
            paddingVertical: 15,
            borderRadius: 5,
            alignItems: 'center',
        },
        buttonText: {
            color: theme.BUTTON_TEXT,
            fontSize: 16,
        },
    })

export default SchoolAuth1
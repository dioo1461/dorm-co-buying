import IcArrowLeft from '@/assets/drawable/ic-arrow-left.svg'
import { darkColors, Icolor, lightColors } from '@/constants/colors'
import { AppContext } from '@/hooks/useContext/AppContext'
import { createSignUpStyles } from '@/styles/signUp/signUpStyles'
import { StringFilter } from '@/utils/StringFilter'
import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import {
    Alert,
    Appearance,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

const SignUp3: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor } = useContext(AppContext)
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
    const navigation = useNavigation()
    const [schoolEmail, setSchoolEmail] = useState('')

    const handleSchoolEmailChange = (text: string) => {
        const cleaned = StringFilter.sqlFilter(text)
        setSchoolEmail(cleaned)
    }

    const handleSchoolEmailSubmit = () => {
        if (validateEmail(schoolEmail) === true) {
            navigation.navigate('SignUp4', {
                schoolEmail: schoolEmail,
            })
        } else {
            Alert.alert('유효한 메일 주소를 입력해주세요.')
        }
    }

    const validateEmail = (number: string) => {
        // TODO : 이메일 validation 구현
        return true
    }

    return (
        <ScrollView style={signUpStyles.container}>
            <View>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                        navigation.goBack()
                    }}
                    style={signUpStyles.backButton}>
                    <IcArrowLeft />
                </TouchableOpacity>
            </View>
            <View style={signUpStyles.headerContainer}>
                <Text style={signUpStyles.subStep}>1. 본인 인증</Text>
                <Text style={signUpStyles.currentStep}>2. 학교 인증</Text>
                <Text style={signUpStyles.title}>
                    {`이용자님의 재학생 여부를\n인증해 주세요.`}
                </Text>
                <Text style={signUpStyles.subStep}>3. 인증 정보 설정</Text>
                <Text style={signUpStyles.subStep}>4. 프로필 정보 입력</Text>
            </View>
            <View>
                <Text style={styles.schoolEmailLabel}>
                    학교 이메일 주소 입력
                </Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={handleSchoolEmailChange}
                    value={schoolEmail}
                    placeholder='B912345@mail.hongik.ac.kr'
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                    keyboardType='email-address'
                    autoFocus={true}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSchoolEmailSubmit}>
                    <Text style={styles.buttonText}>인증 코드 발송</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        schoolEmailLabel: {
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
            backgroundColor: theme.BUTTON_BG,
            paddingVertical: 15,
            borderRadius: 5,
            alignItems: 'center',
        },
        buttonText: {
            color: theme.BUTTON_TEXT,
            fontSize: 16,
        },
    })

export default SignUp3

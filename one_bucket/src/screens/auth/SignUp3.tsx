import { signUpHeaderStyles } from '@/styles/signUp/signUpHeaderStyles'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

const SignUp3 = () => {
    const navigation = useNavigation()
    const [schoolEmail, setSchoolEmail] = useState('')

    const handleSchoolEmailChange = (text: string) => {
        // SQL Injection 방지를 위해 특수문자 제거
        const cleaned = text.replaceAll(/[;'"%_&|^#*!<>=?\\\s]/g, '')
        let formatted = cleaned
        setSchoolEmail(formatted)
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
        <View style={signUpHeaderStyles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={signUpHeaderStyles.backButton}>
                <Image
                    source={require('@/assets/drawable/ic-arrow-outline.png')}
                />
            </TouchableOpacity>
            <View style={signUpHeaderStyles.headerContainer}>
                <Text style={signUpHeaderStyles.subStep}>1. 본인 인증</Text>
                <Text style={signUpHeaderStyles.currentStep}>2. 학교 인증</Text>
                <Text style={signUpHeaderStyles.title}>
                    {`이용자님의 재학생 여부를\n인증해 주세요.`}
                </Text>
                <Text style={signUpHeaderStyles.subStep}>
                    3. 이메일 및 비밀번호 설정
                </Text>
                <Text style={signUpHeaderStyles.subStep}>
                    4. 프로필 정보 입력
                </Text>
                <Text style={styles.schoolEmailLabel}>
                    학교 이메일 주소 입력
                </Text>
            </View>
            <View>
                <TextInput
                    style={styles.input}
                    onChangeText={handleSchoolEmailChange}
                    value={schoolEmail}
                    placeholder='B912345@mail.hongik.ac.kr'
                    keyboardType='email-address'
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSchoolEmailSubmit}>
                    <Text style={styles.buttonText}>인증 코드 발송</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    schoolEmailLabel: {
        fontSize: 18,
        color: 'black',
        alignSelf: 'center',
        fontFamily: 'NanumGothic-Bold',
        marginTop: 30,
        marginBottom: 10,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingBottom: 4,
        fontSize: 16,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#0A3D62',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
})

export default SignUp3

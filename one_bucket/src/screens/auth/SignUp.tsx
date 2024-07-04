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

const SignUp = () => {
    const navigation = useNavigation()
    const [phoneNumber, setPhoneNumber] = useState('')

    const handlePhoneNumberChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, '') // Remove non-numeric characters
        let formatted = cleaned

        if (cleaned.length > 3 && cleaned.length <= 6) {
            formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
        } else if (cleaned.length > 6 && cleaned.length < 11) {
            formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(
                3,
                6,
            )}-${cleaned.slice(6, 11)}`
        } else if (cleaned.length >= 11) {
            formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(
                3,
                7,
            )}-${cleaned.slice(7, 11)}`
        }

        setPhoneNumber(formatted)
    }

    const handlePhoneNumberSubmit = () => {
        if (validatePhoneNumber(phoneNumber) === true) {
            navigation.navigate('SignUp_2', {
                phoneNumber: phoneNumber,
            })
        } else {
            Alert.alert('휴대폰 번호를 정확히 입력해주세요.')
        }
    }

    const validatePhoneNumber = (number: string) => {
        // TODO : 최초 세자리 (010, 011, ...) validation 구현
        if (number.replaceAll('-', '').length >= 10) {
            return true
        } else {
            return false
        }
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
            <View>
                <Text style={signUpHeaderStyles.currentStep}>1. 본인 인증</Text>
                <Text style={signUpHeaderStyles.title}>
                    {`한바구니를 이용하기 위해\n본인인증이 필요해요.`}
                </Text>
                <Text style={signUpHeaderStyles.subStep}>2. 학교 인증</Text>
                <Text style={signUpHeaderStyles.subStep}>
                    3. 이메일 및 비밀번호 설정
                </Text>
                <Text style={signUpHeaderStyles.subStep}>
                    4. 프로필 정보 입력
                </Text>
                <Text style={styles.phoneLabel}>휴대폰 번호 입력</Text>
            </View>
            <View>
                <TextInput
                    style={styles.input}
                    onChangeText={handlePhoneNumberChange}
                    value={phoneNumber}
                    placeholder="'-' 없이 입력"
                    keyboardType='number-pad'
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handlePhoneNumberSubmit}>
                    <Text style={styles.buttonText}>인증번호 발송</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    phoneLabel: {
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
        paddingBottom: 8,
        fontSize: 20,
        textAlign: 'center',
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

export default SignUp

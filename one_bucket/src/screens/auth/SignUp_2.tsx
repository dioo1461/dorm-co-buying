import { baseColors } from '@/constants/colors'
import { signUpHeaderStyles } from '@/styles/signUp/signUpHeaderStyles'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

const SignUp_2 = () => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const navigation = useNavigation()

    const handleSendCode = () => {
        // 인증번호 발송 로직 추가
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
            </View>
            <View style={styles.verificationContainer}>
                <Text style={styles.phoneNumber}>010 - 43** - **61</Text>
                <Text style={styles.infoText}>
                    번호로 발송된 인증번호를 입력해 주세요.
                </Text>
                <Text style={styles.inputLabel}>인증번호 입력</Text>
                <View style={styles.codeInputContainer}>
                    {Array(6)
                        .fill(0)
                        .map((_, index) => (
                            <TextInput
                                key={index}
                                style={styles.codeInput}
                                value={verificationCode[index] || ''}
                                onChangeText={text => {
                                    let newCode = verificationCode.split('')
                                    newCode[index] = text
                                    setVerificationCode(newCode.join(''))
                                }}
                                keyboardType='numeric'
                                maxLength={1}
                            />
                        ))}
                </View>
                <TouchableOpacity
                    style={styles.resendButton}
                    onPress={handleSendCode}>
                    <Image
                        source={require('@/assets/drawable/ic-refresh-gray.png')}
                    />
                    <Text style={styles.resendButtonText}>인증번호 재발송</Text>
                </TouchableOpacity>
                <Text style={styles.infoText}>
                    30초 후에 다시 시도해 주세요.
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    phoneNumber: {
        fontSize: 14,
        color: baseColors.GRAY_1,
        fontFamily: 'NanumGothic',
        marginTop: 30,
        marginBottom: 6,
    },
    infoText: {
        fontSize: 14,
        fontFamily: 'NanumGothic',
        color: 'black',
    },
    inputLabel: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'NanumGothic-Bold',
        marginTop: 30,
        marginBottom: 20,
    },
    verificationContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    codeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    codeInput: {
        height: 50,
        width: 40,
        borderColor: baseColors.GRAY_1,
        borderWidth: 1,
        borderRadius: 10,
        textAlign: 'center',
        marginEnd: 5,
        fontSize: 18,
    },
    resendButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 10,
    },
    resendButtonText: {
        marginLeft: 5,
        fontSize: 16,
        color: baseColors.GRAY_1,
    },
})

export default SignUp_2

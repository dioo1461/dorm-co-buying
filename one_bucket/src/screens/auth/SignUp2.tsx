import IcArrowLeft from '@/assets/drawable/ic-arrow-left.svg'
import IcRefresh from '@/assets/drawable/ic-refresh.svg'
import { baseColors } from '@/constants/colors'
import { AppContext } from '@/hooks/useContext/AppContext'
import { signUpStyles } from '@/styles/signUp/signUpStyles'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { RootStackParamList } from '../navigation/NativeStackNavigation'

const SignUp2: React.FC = (): React.JSX.Element => {
    const dummyVerificationCode = '000000'
    const { onPhoneVerificationFailure } = useContext(AppContext)

    type SignUp2RouteProp = RouteProp<RootStackParamList, 'SignUp2'>
    const { params } = useRoute<SignUp2RouteProp>()

    const [phoneNumber, setPhoneNumber] = useState('')
    const navigation = useNavigation()
    const inputRef = useRef<(TextInput | null)[]>([])
    const [verificationCode, setVerificationCode] = useState(Array(6).fill(''))
    const [nextIndex, setNextIndex] = useState(0)

    useEffect(() => {
        // 키패드 팝업이 되지 않는 문제를 해결하기 위해, 렌더링이 완료된 후
        // 포커스를 설정하는 requestAnimationFrame 메서드 사용
        requestAnimationFrame(() => {
            inputRef.current[0]?.focus()
        })
    }, [])

    useEffect(() => {
        // input code의 입력에 대한 처리
        if (nextIndex < 6) {
            inputRef.current[nextIndex]?.focus()
        }
        const code = verificationCode.join('')
        if (code.length == 6) {
            if (VerifyCode(code)) {
                refreshCodeInput()
                Keyboard.dismiss()
                navigation.navigate('SignUp3')
            } else {
                refreshCodeInput()
                onPhoneVerificationFailure()
            }
        }
    }, [nextIndex, verificationCode])

    const refreshCodeInput = () => {
        inputRef.current.map(input => {
            input?.clear()
            verificationCode.fill('')
        })
        inputRef.current[0]?.focus()
    }

    const VerifyCode = (code: string) => {
        if (code === dummyVerificationCode) {
            return true
        } else {
            return false
        }
    }

    const maskPhoneNumber = (phoneNumber: string) => {
        const phoneParts = phoneNumber.split('-')
        if (phoneParts.length !== 3) {
            // 전화번호 형식이 올바르지 않을 경우
            return phoneNumber
        }

        const firstPart = phoneParts[0]

        // 마지막 두 자리를 제외하고 마스킹
        // 긍정형 후방 탐색(?<=...)과 긍정형 전방 탐색(?=..)을 사용하여 구현
        const secondPart = phoneParts[1].replace(/.(?<=...)/g, '*')
        const thirdPart = phoneParts[2].replace(/.(?=..)/g, '*')
        return `${firstPart} - ${secondPart} - ${thirdPart}`
    }

    return (
        <View style={signUpStyles.container}>
            <View>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={signUpStyles.backButton}>
                    <IcArrowLeft fill={baseColors.GRAY_1} />
                </TouchableOpacity>
            </View>
            <View style={signUpStyles.headerContainer}>
                <Text style={signUpStyles.currentStep}>1. 본인 인증</Text>
                <Text style={signUpStyles.title}>
                    {`한바구니를 이용하기 위해 본인인증이 필요해요.`}
                </Text>
                <Text style={signUpStyles.subStep}>2. 학교 인증</Text>
                <Text style={signUpStyles.subStep}>3. 인증 정보 설정</Text>
                <Text style={signUpStyles.subStep}>4. 프로필 정보 입력</Text>
            </View>
            <View style={styles.verificationContainer}>
                <Text style={styles.phoneNumber}>
                    {maskPhoneNumber(params?.phoneNumber)}
                </Text>
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
                                ref={el => (inputRef.current[index] = el)}
                                style={styles.codeInput}
                                onChangeText={text => {
                                    if (text == '') {
                                        // 숫자를 지운 경우
                                        verificationCode[index] = ''
                                        setNextIndex(index - 1)
                                    } else {
                                        // 숫자를 입력한 경우
                                        verificationCode[index] = text
                                        setNextIndex(index + 1)
                                    }
                                }}
                                keyboardType='numeric'
                                maxLength={1}
                            />
                        ))}
                </View>
                <TouchableOpacity
                    style={styles.resendButton}
                    onPress={refreshCodeInput}>
                    <IcRefresh />
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
        marginTop: 16,
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

export default SignUp2

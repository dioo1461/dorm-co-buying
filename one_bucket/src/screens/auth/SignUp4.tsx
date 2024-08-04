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

const SignUp4: React.FC = (): React.JSX.Element => {
    const dummyVerificationCode = '000000'
    const { onSchoolEmailVerificationFailure } = useContext(AppContext)

    type SignUp4RouteProp = RouteProp<RootStackParamList, 'SignUp4'>
    const { params } = useRoute<SignUp4RouteProp>()

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
        if (verificationCode.join('').length == 6) {
            if (verificationCode.join('') === dummyVerificationCode) {
                refreshCodeInput()
                Keyboard.dismiss()
                navigation.navigate('SignUp5')
            } else {
                refreshCodeInput()
                onSchoolEmailVerificationFailure()
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

    const handleCodeVerification = () => {
        // TODO : 인증번호 발송 API 호출
    }

    const maskSchoolEmail = (schoolEmail: string) => {
        const [localPart, domain] = schoolEmail.split('@')

        const maskedLocalPart = localPart
            .split('')
            .map((char, index) => {
                if (index === 0 || index === localPart.length - 1) {
                    return char
                }
                return '*'
            })
            .join('')

        return `${maskedLocalPart}@${domain}`
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
                <Text style={signUpStyles.subStep}>1. 본인 인증</Text>
                <Text style={signUpStyles.currentStep}>2. 학교 인증</Text>
                <Text style={signUpStyles.title}>
                    {`이용자님의 재학생 여부를\n인증해 주세요.`}
                </Text>
                <Text style={signUpStyles.subStep}>3. 인증 정보 설정</Text>
                <Text style={signUpStyles.subStep}>4. 프로필 정보 입력</Text>
            </View>
            <View style={styles.verificationContainer}>
                <Text style={styles.schoolEmail}>
                    {maskSchoolEmail(params?.schoolEmail)}
                </Text>
                <Text style={styles.infoText}>
                    이메일로 발송된 인증 코드를 입력해 주세요.
                </Text>
                <Text style={styles.inputLabel}>인증 코드 입력</Text>
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
                    <Text style={styles.resendButtonText}>
                        인증 코드 재발송
                    </Text>
                </TouchableOpacity>
                <Text style={styles.infoText}>
                    30초 후에 다시 시도해 주세요.
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    schoolEmail: {
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

export default SignUp4

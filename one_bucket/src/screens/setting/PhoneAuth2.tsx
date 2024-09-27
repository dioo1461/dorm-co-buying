import IcArrowLeft from '@/assets/drawable/ic-arrow-left.svg'
import IcRefresh from '@/assets/drawable/ic-refresh.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createSignUpStyles } from '@/styles/signUp/signUpStyles'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import {
    Appearance,
    Keyboard,
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

const PhoneAuth2: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor, onPhoneVerificationFailure } =
        useBoundStore(state => ({
            themeColor: state.themeColor,
            setThemeColor: state.setThemeColor,
            onPhoneVerificationFailure: state.onPhoneVerificationFailure,
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

    const dummyVerificationCode = '000000'

    type PhoneAuth2RouteProp = RouteProp<RootStackParamList, 'PhoneAuth2'>
    const { params } = useRoute<PhoneAuth2RouteProp>()

    const [phoneNumber, setPhoneNumber] = useState('')
    const navigation = stackNavigation()
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
                navigation.navigate('PhoneAuth3')
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
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={signUpStyles.backButton}>
                <IcArrowLeft />
            </TouchableOpacity>
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
                                maxLength={1}
                            />
                        ))}
                </View>
                <TouchableOpacity
                    style={styles.resendButton}
                    onPress={refreshCodeInput}>
                    <IcRefresh />
                    <Text style={styles.resendButtonLabel}>
                        인증번호 재발송
                    </Text>
                </TouchableOpacity>
                <Text style={styles.infoText}>
                    30초 후에 다시 시도해 주세요.
                </Text>
            </View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        phoneNumber: {
            color: theme.TEXT_TERTIARY,
            fontSize: 14,
            fontFamily: 'NanumGothic',
            marginTop: 16,
            marginBottom: 6,
        },
        infoText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
        inputLabel: {
            color: theme.TEXT,
            fontSize: 16,
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
            color: theme.TEXT,
            borderColor: baseColors.GRAY_3,
            height: 50,
            width: 40,
            borderWidth: 1,
            borderRadius: 10,
            textAlign: 'center',
            marginEnd: 5,
            fontSize: 18,
        },
        resendButton: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
            marginBottom: 10,
        },
        resendButtonLabel: {
            color: theme.TEXT_SECONDARY,
            fontSize: 16,
            fontFamily: 'NanumGothic',
            marginLeft: 5,
        },
    })

export default PhoneAuth2
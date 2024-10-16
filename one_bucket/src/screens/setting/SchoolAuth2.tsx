import IcArrowLeft from '@/assets/drawable/ic-arrow-left.svg'
import IcRefresh from '@/assets/drawable/ic-refresh.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createSignUpStyles } from '@/styles/signUp/signUpStyles'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import {
    Alert,
    Appearance,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import {
    RootStackParamList,
    stackNavigation,
} from '../navigation/NativeStackNavigation'
import { SchoolAuthRequestBody } from '@/data/request/signUpRequestBody'
import { postSchoolForm } from '@/apis/authService'
import { CodeValRequestBody } from '@/data/request/signUpRequestBody'
import { postCodeForm } from '@/apis/authService'
import { setAccessToken } from '@/utils/accessTokenUtils'

const SchoolAuth2: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor, onSchoolEmailVerificationFailure } =
        useBoundStore(state => ({
            themeColor: state.themeColor,
            setThemeColor: state.setThemeColor,
            onSchoolEmailVerificationFailure:
                state.onSchoolEmailVerificationFailure,
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

    type SchoolAuth2RouteProp = RouteProp<RootStackParamList, 'SchoolAuth2'>
    const { params } = useRoute<SchoolAuth2RouteProp>()

    const navigation = stackNavigation()
    const inputRef = useRef<(TextInput | null)[]>([])
    const [verificationCode, setVerificationCode] = useState(Array(6).fill(''))
    const [nextIndex, setNextIndex] = useState(0)
    const [count, setCount] = useState(300)

    useEffect(() => {
        const id = setInterval(() => {
          setCount(count => count - 1); 
        }, 1000);
        if(count === 0){
          clearInterval(id);
        }
        return () => clearInterval(id);
      }, [count]);

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
            const form: CodeValRequestBody = {
                university: params.schoolName,
                universityEmail: params.schoolEmail,
                verifiedCode: verificationCode.join('')
            }
            postCodeForm(form)
                .then(res => {
                    navigation.navigate('SchoolAuth3')
                })
                .catch(err => {
                    console.log(`SchoolAuth2 - submitSignUpForm: ${err}`)
                })
            refreshCodeInput()
            Keyboard.dismiss()
        }
    }, [nextIndex, verificationCode])

    const infoWithTimer = (time: number) => {
        const min = Math.floor(time/60)
        const sec = time % 60
        if(time==0) Alert.alert('인증 코드가 만료되었습니다. 다시 발급받아 보세요.')
        return (
            <View style={{flexDirection: "row"}}>
                <Text style={styles.inputLabel}>인증 코드 입력</Text>
                <Text style={{...styles.inputLabel, color: count<=30 ? "red" : 'dodgerblue'}}>
                    {`(${min}:${String(sec).padStart(2,"0")})`}
                </Text>
            </View>
        )
    }

    const refreshCodeInput = () => {
        inputRef.current.map(input => {
            input?.clear()
            verificationCode.fill('')
        })
        inputRef.current[0]?.focus()

        const form: SchoolAuthRequestBody = {
            university: params.schoolName,
            universityEmail: params.schoolEmail,
        }
        postSchoolForm(form)
            .then(res => {
                Toast.show({ text1: '인증 코드를 재발급했습니다.' })
                setCount(300)
            })
            .catch(err => {
                console.log(`refreshCodeInput - submitSignUpForm: ${err}`)
            })
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
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={signUpStyles.backButton}>
                <IcArrowLeft />
            </TouchableOpacity>
            <View style={styles.verificationContainer}>
                <Text style={styles.schoolEmail}>
                    {maskSchoolEmail(params?.schoolEmail)}
                </Text>
                <Text style={styles.infoText}>
                    이메일로 발송된 인증 코드를 입력해 주세요.
                </Text>
                {infoWithTimer(count)}
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
                                keyboardType='default'
                                maxLength={1}
                            />
                        ))}
                </View>
                <TouchableOpacity
                    style={styles.resendButton}
                    onPress={refreshCodeInput}>
                    <IcRefresh />
                    <Text style={styles.resendButtonLabel}>
                        인증 코드 재발송
                    </Text>
                </TouchableOpacity>
                {/*
                <Text style={styles.infoText}>
                    30초 후에 다시 시도해 주세요.
                </Text> */}
            </View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        schoolEmail: {
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

export default SchoolAuth2
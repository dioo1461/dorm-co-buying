import { postSignupForm, requestLogin } from '@/apis/authService'
import IcHide from '@/assets/drawable/clarity_eye-hide-line.svg'
import IcShow from '@/assets/drawable/clarity_eye-show-line.svg'
import Exclamation from '@/assets/drawable/exclamation.svg'
import IcArrowLeft from '@/assets/drawable/ic-arrow-left.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { signUpErrorMessage } from '@/constants/strings'
import { LoginRequestBody } from '@/data/request/LoginRequestBody'
import { SignUpRequestBody } from '@/data/request/SignUpRequestBody'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createSignUpStyles } from '@/styles/signUp/signUpStyles'
import { StringFilter } from '@/utils/StringFilter'
import React, { useEffect, useRef, useState } from 'react'
import {
    Alert,
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
import { ScreenWidth } from 'react-native-elements/dist/helpers'
import { stackNavigation } from '../navigation/NativeStackNavigation'
const SignUp5: React.FC = (): React.JSX.Element => {
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
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [nickname, setNickname] = useState('')

    const [emailError, setEmailError] = useState<string | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [passwordConfirmError, setPasswordConfirmError] = useState<
        string | null
    >(null)
    const [nicknameError, setNicknameError] = useState<string | null>(null)

    const scrollViewRef = useRef<ScrollView>(null)
    const passwordRef = useRef<TextInput>(null)
    const passwordConfirmRef = useRef<TextInput>(null)

    const [hidePw, setHidePw] = useState(true)
    const viewPwIcon = (hidePw: boolean) => {
        if (hidePw == true)
            return (
                <View>
                    <IcHide />
                </View>
            )
        else
            return (
                <View>
                    <IcShow />
                </View>
            )
    }

    const handleEmailChange = (text: string) => {
        if (emailError == signUpErrorMessage.duplicatedEmailOrNickname) {
            setEmailError(null)
        }
        var cleaned = StringFilter.sqlFilter(text)
        setEmail(cleaned)
    }

    const handlePasswordChange = (text: string) => {
        setPassword(text)
        if (text.length < 8 || text.length > 20) {
            setPasswordError(signUpErrorMessage.invalidPasswordLength)
            return
        }
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/
        if (!regex.test(text)) {
            setPasswordError(signUpErrorMessage.invalidPasswordFormat)
            return
        }
        setPasswordError(null)
    }

    const handleScrollViewSwipe = (index: number) => {
        if (password == '' || passwordError) return
        scrollViewRef.current?.scrollTo({
            x: (ScreenWidth - 40) * index,
            y: 0,
            animated: true,
        })
    }

    const handlePasswordConfirmChange = (text: string) => {
        setPasswordConfirm(text)
        if (text !== password) {
            setPasswordConfirmError(signUpErrorMessage.passwordMismatch)
            return
        }
        setPasswordConfirmError(null)
    }

    const handleNicknameChange = (text: string) => {
        if (emailError == signUpErrorMessage.duplicatedEmailOrNickname) {
            setNicknameError(null)
        }
        const cleaned = StringFilter.removeSpecials(text)
        setNickname(cleaned)
        if (cleaned.length < 4 || 14 < cleaned.length) {
            setNicknameError(signUpErrorMessage.invalidNicknameLength)
            return
        }
        setNicknameError(null)
    }

    const handleSubmit = async () => {
        if (!validateEmail(email)) {
            Alert.alert('유효한 메일 주소를 입력해주세요.')
            return
        }

        const form: SignUpRequestBody = {
            username: email,
            password: password,
            nickname: nickname,
        }
        postSignupForm(form)
            .then(res => {
                const loginForm: LoginRequestBody = {
                    username: email,
                    password: password,
                }

                requestLogin(loginForm)
                    .then(res => {
                        navigation.navigate('SignUp6')
                    })
                    .catch(err => {
                        console.log(`signUp5 - requestLogin: ${err}`)
                    })
            })
            .catch(err => {
                console.log(`signUp5 - submitSignUpForm: ${err}`)
                if (err.response.status === 409) {
                    if (err.response.data.code == 1000) {
                        setEmailError(
                            signUpErrorMessage.duplicatedEmailOrNickname,
                        )
                        setNicknameError(
                            signUpErrorMessage.duplicatedEmailOrNickname,
                        )
                    }
                }
            })
    }

    const validateEmail = (number: string) => {
        // TODO : 이메일 validation 구현
        return true
    }

    const onPasswordReEnterButtonPress = () => {
        handleScrollViewSwipe(0)
        passwordRef.current?.focus()
        setPassword('')
        setPasswordConfirm('')
    }

    const onPasswordInputBlur = () => {
        handleScrollViewSwipe(1)
        passwordConfirmRef.current?.focus()
    }

    return (
        <ScrollView style={signUpStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'position'}>
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack()
                        }}
                        style={signUpStyles.backButton}>
                        <IcArrowLeft />
                    </TouchableOpacity>
                </View>
                <View>
                    <View style={signUpStyles.headerContainer}>
                        <Text style={signUpStyles.currentStep}>
                            1. 인증 정보 설정
                        </Text>
                        <Text style={signUpStyles.title}>
                            {`로그인 시 사용할 인증 정보를 설정해 주세요.`}
                        </Text>
                        <Text style={signUpStyles.subStep}>
                            2. 프로필 정보 입력
                        </Text>
                    </View>
                    <View>
                        {/* ### 이메일 입력 ### */}
                        <Text style={styles.label}>로그인 아이디 입력</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleEmailChange}
                            value={email}
                            placeholder='아이디(8~20자)'
                            placeholderTextColor={themeColor.TEXT_SECONDARY}
                        />
                        <View
                            style={[
                                { opacity: emailError ? 1 : 0 },
                                styles.errorLabelContainer,
                            ]}>
                            <Exclamation
                                fill={themeColor.ACCENT_TEXT}
                                style={styles.exclamation}
                            />
                            <Text style={styles.errorLabel}>{emailError}</Text>
                        </View>

                        {/* ### 비밀번호 입력 ### */}
                        {/*
                        <ScrollView
                            ref={scrollViewRef}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}> */}
                        <View style={{ width: ScreenWidth - 40 }}>
                            <Text style={styles.label}>비밀번호 입력</Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <TextInput
                                    ref={passwordRef}
                                    style={styles.input}
                                    onChangeText={handlePasswordChange}
                                    onBlur={onPasswordInputBlur}
                                    value={password}
                                    placeholder='숫자, 대소문자, 특수문자 모두 포함하여 8~20자'
                                    placeholderTextColor={
                                        themeColor.TEXT_SECONDARY
                                    }
                                    keyboardType='default'
                                    secureTextEntry={hidePw}
                                    scrollEnabled={false}
                                />
                                <TouchableOpacity
                                    style={styles.viewPw}
                                    onPress={() => {
                                        setHidePw(!hidePw)
                                    }}>
                                    {viewPwIcon(hidePw)}
                                </TouchableOpacity>
                            </View>
                            <View
                                style={[
                                    { opacity: passwordError ? 1 : 0 },
                                    styles.errorLabelContainer,
                                ]}>
                                <Exclamation
                                    fill={themeColor.ACCENT_TEXT}
                                    style={styles.exclamation}
                                />
                                <Text style={styles.errorLabel}>
                                    {passwordError}
                                </Text>
                            </View>
                        </View>
                        <View style={{ width: ScreenWidth - 41 }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={styles.label}>비밀번호 확인</Text>
                                {/*
                                    <TouchableOpacity
                                        style={styles.pwReEnterButton}
                                        onPress={onPasswordReEnterButtonPress}>
                                        <Text
                                            style={styles.pwReEnterButtonText}>
                                            재입력
                                        </Text>
                                    </TouchableOpacity> */}
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <TextInput
                                    ref={passwordConfirmRef}
                                    style={styles.input}
                                    onChangeText={handlePasswordConfirmChange}
                                    value={passwordConfirm}
                                    placeholder='비밀번호를 다시 한 번 입력해 주세요.'
                                    placeholderTextColor={
                                        themeColor.TEXT_SECONDARY
                                    }
                                    keyboardType='default'
                                    secureTextEntry={hidePw}
                                    scrollEnabled={false}
                                />
                                <TouchableOpacity
                                    style={styles.viewPw}
                                    onPress={() => {
                                        setHidePw(!hidePw)
                                    }}>
                                    {viewPwIcon(hidePw)}
                                </TouchableOpacity>
                            </View>
                            <View
                                style={[
                                    {
                                        opacity: passwordConfirmError ? 1 : 0,
                                    },
                                    styles.errorLabelContainer,
                                ]}>
                                <Exclamation
                                    fill={themeColor.ACCENT_TEXT}
                                    style={styles.exclamation}
                                />
                                <Text style={styles.errorLabel}>
                                    {passwordConfirmError}
                                </Text>
                            </View>
                        </View>
                        {/* </ScrollView> */}

                        {/* ### 닉네임 입력 ### */}
                        <Text style={styles.label}>닉네임 입력</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleNicknameChange}
                            value={nickname}
                            placeholder='닉네임(4~14자)'
                            placeholderTextColor={themeColor.TEXT_SECONDARY}
                            keyboardType='default'
                            scrollEnabled={false}
                        />
                        <View
                            style={[
                                { opacity: nicknameError ? 1 : 0 },
                                styles.errorLabelContainer,
                            ]}>
                            <Exclamation
                                fill={themeColor.ACCENT_TEXT}
                                style={styles.exclamation}
                            />
                            <Text style={styles.errorLabel}>
                                {nicknameError}
                            </Text>
                        </View>

                        <TouchableOpacity
                            disabled={
                                !!(
                                    emailError ||
                                    passwordError ||
                                    nicknameError ||
                                    passwordConfirmError ||
                                    !email ||
                                    !password ||
                                    !nickname ||
                                    !passwordConfirm
                                )
                            }
                            style={[
                                {
                                    backgroundColor:
                                        emailError ||
                                        passwordError ||
                                        nicknameError ||
                                        passwordConfirmError ||
                                        !email ||
                                        !password ||
                                        !nickname ||
                                        !passwordConfirm
                                            ? baseColors.GRAY_2
                                            : baseColors.SCHOOL_BG,
                                },
                                styles.button,
                            ]}
                            onPress={handleSubmit}>
                            {/* onPress={() => navigation.navigate('SignUp6')}> */}
                            <Text style={styles.buttonText}>다음</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {},
        label: {
            fontSize: 18,
            color: theme.TEXT,
            fontFamily: 'NanumGothic-Bold',
            marginTop: 20,
            marginBottom: 5,
        },
        input: {
            width: ScreenWidth - 80,
            color: theme.TEXT,
            borderBottomColor: baseColors.GRAY_1,
            borderBottomWidth: 1,
            paddingBottom: 4,
            fontSize: 16,
            marginBottom: 10,
        },
        viewPw: {
            height: 36,
            width: 36,
            justifyContent: 'center',
            alignItems: 'center',
        },
        errorLabelContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        exclamation: {
            width: 16,
            height: 16,
            marginBottom: 4,
            marginEnd: 4,
        },
        errorLabel: {
            color: theme.ACCENT_TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 12,
            marginBottom: 5,
        },
        button: {
            paddingVertical: 15,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 30,
        },
        buttonText: {
            color: theme.BUTTON_TEXT,
            fontSize: 16,
        },
        pwReEnterButton: {
            borderColor: baseColors.GRAY_1,
            borderRadius: 6,
            borderWidth: 1,
            padding: 8,
            marginTop: 12,
        },
        pwReEnterButtonText: {
            color: theme.BUTTON_SECONDARY_TEXT,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
    })

export default SignUp5

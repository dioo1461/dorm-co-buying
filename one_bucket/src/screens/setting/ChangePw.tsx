import { postChangePwForm, requestLogin } from '@/apis/authService'
import Exclamation from '@/assets/drawable/exclamation.svg'
import IcArrowLeft from '@/assets/drawable/ic-arrow-left.svg'
import IcHide from '@/assets/drawable/clarity_eye-hide-solid.svg'
import IcShow from '@/assets/drawable/clarity_eye-show-solid.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { signUpErrorMessage } from '@/constants/strings'
import { LoginRequestBody } from '@/data/request/LoginRequestBody'
import { ChangePwRequestBody } from '@/data/request/SignUpRequestBody'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createSignUpStyles } from '@/styles/signUp/signUpStyles'
import { setAccessToken } from '@/utils/accessTokenUtils'
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
import Toast from 'react-native-toast-message'
import { ScreenWidth } from 'react-native-elements/dist/helpers'
import { stackNavigation } from '../navigation/NativeStackNavigation'

const ChangePw: React.FC = (): React.JSX.Element => {
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
    const [oldPw, setOldPw] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const [hideOldPw, setHideOldPw] = useState(true)
    const [hideNewPw, setHideNewPw] = useState(true)
    const viewPwIcon = (hidePw: boolean) => {
        if(hidePw == true) return (
            <View><IcHide /></View>
        )
        else return (
            <View><IcShow /></View>
        )
    }


    const [emailError, setEmailError] = useState<string | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [passwordConfirmError, setPasswordConfirmError] = useState<
        string | null
    >(null)

    const scrollViewRef = useRef<ScrollView>(null)
    const passwordRef = useRef<TextInput>(null)
    const passwordConfirmRef = useRef<TextInput>(null)

    const handleOldPwChange = (text: string) => {
        if (emailError == signUpErrorMessage.wrongPassword) {
            setEmailError(null)
        }
        var cleaned = StringFilter.removeSpaces(text)
        setOldPw(cleaned)
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
        if (text == oldPw) {
            setPasswordConfirmError(signUpErrorMessage.passwordUnchanged)
            return
        }
        setPasswordConfirmError(null)
    }

    const handleSubmit = async () => {
        const form: ChangePwRequestBody = {
            oldPassword: oldPw,
            newPassword: password,
        }
        postChangePwForm(form)
            .then(res => {
                navigation.navigate('ChangePw2')
            })
            .catch(err => {
                console.log(`ChangePw - submitSignUpForm: ${err}`)
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
        <View style={signUpStyles.container}>
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
                    <View style={styles.verificationContainer}>
                        <Text style={styles.infoText}>
                            현재 비밀번호를 변경할 수 있습니다.
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.label}>
                            현재 비밀번호 입력
                        </Text>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center"
                            }}>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleOldPwChange}
                                value={oldPw}
                                placeholder='현재 비밀번호'
                                placeholderTextColor={themeColor.TEXT_SECONDARY}
                                secureTextEntry={hideOldPw}
                            />
                            <TouchableOpacity
                                style={styles.viewPw}
                                onPress={()=>{setHideOldPw(!hideOldPw)}}>
                                {viewPwIcon(hideOldPw)}
                            </TouchableOpacity>
                        </View>
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
                        <ScrollView
                            ref={scrollViewRef}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}>
                            <View style={{ width: ScreenWidth - 40 }}>
                                <Text style={styles.label}>새 비밀번호 입력</Text>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center"
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
                                        secureTextEntry={hideNewPw}
                                        scrollEnabled={false}
                                    />
                                    <TouchableOpacity
                                        style={styles.viewPw}
                                        onPress={()=>{setHideNewPw(!hideNewPw)}}>
                                        {viewPwIcon(hideNewPw)}
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
                                    <Text style={styles.label}>
                                        비밀번호 확인
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.pwReEnterButton}
                                        onPress={onPasswordReEnterButtonPress}>
                                        <Text
                                            style={styles.pwReEnterButtonText}>
                                            재입력
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center"
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
                                        secureTextEntry={hideNewPw}
                                        scrollEnabled={false}
                                    />
                                    <TouchableOpacity
                                        style={styles.viewPw}
                                        onPress={()=>{setHideNewPw(!hideNewPw)}}>
                                        {viewPwIcon(hideNewPw)}
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={[
                                        {
                                            opacity: passwordConfirmError
                                                ? 1
                                                : 0,
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
                        </ScrollView>

                        <TouchableOpacity
                            disabled={
                                !!(
                                    emailError ||
                                    passwordError ||
                                    passwordConfirmError ||
                                    !oldPw ||
                                    !password ||
                                    !passwordConfirm
                                )
                            }
                            style={[
                                {
                                    backgroundColor:
                                        emailError ||
                                        passwordError ||
                                        passwordConfirmError ||
                                        !oldPw ||
                                        !password ||
                                        !passwordConfirm
                                            ? baseColors.GRAY_2
                                            : baseColors.SCHOOL_BG,
                                },
                                styles.button,
                            ]}
                            onPress={handleSubmit}>
                            {/* onPress={() => navigation.navigate('ChangePw2')}> */}
                            <Text style={styles.buttonText}>다음</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
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
        infoText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
        verificationContainer: {
            marginVertical: 20,
            alignItems: 'center',
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
        viewPw:{
            height: 36,
            width: 36,
            justifyContent: "center",
            alignItems: "center",
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

export default ChangePw
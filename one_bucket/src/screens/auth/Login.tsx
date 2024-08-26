import { requestLogin } from '@/apis/authService'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { AppContext } from '@/hooks/useContext/AppContext'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import { setAccessToken } from '@/utils/accessTokenMethods'
import React, { useContext, useEffect, useRef } from 'react'
import {
    Appearance,
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import BouncyCheckbox, {
    BouncyCheckboxHandle,
} from 'react-native-bouncy-checkbox'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Login: React.FC = (): React.JSX.Element => {
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
    // const styles = createStyles(themeColor)

    const [id, setId] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [isAutoLogin, setIsAutoLogin] = React.useState(false)
    const { onLogInSuccess, onLoginFailure } = useContext(AppContext)
    const navigation = stackNavigation()

    let bouncyCheckboxRef = useRef<BouncyCheckboxHandle>(null)

    const handleLogin = async () => {
        const loginForm = {
            username: id,
            password: password,
        }
        requestLogin(loginForm)
            .then(res => {
                setAccessToken(res.accessToken)
                onLogInSuccess()
            })
            .catch(err => {
                onLoginFailure()
            })
    }

    const handleForgotPassword = () => {}

    const handleGoogleLogin = () => {}

    return (
        <View style={[styles.container]}>
            <View
                style={{
                    flex: 4,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginBottom: 50,
                }}>
                <Image source={require('@/assets/drawable/login_logo.png')} />
            </View>
            <View
                style={{
                    flex: 5,
                    alignItems: 'center',
                    width: '100%',
                }}>
                <TextInput
                    style={styles.textInput}
                    placeholder='아이디'
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                    value={id}
                    onChangeText={setId}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder='비밀번호'
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <View style={styles.autoLoginContainer}>
                    <View style={{ width: '5%' }}>
                        <BouncyCheckbox
                            ref={bouncyCheckboxRef}
                            size={25}
                            fillColor={themeColor.BUTTON_BG}
                            onPress={isAutoLogin =>
                                setIsAutoLogin(!isAutoLogin)
                            }
                        />
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                bouncyCheckboxRef.current?.onCheckboxPress()
                            }}>
                            <Text style={styles.checkboxLabel}>
                                로그인 상태 유지
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.loginButtonContainer}>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>로그인</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.signUpButtonContainer]}>
                    <TouchableOpacity
                        style={styles.signUpButton}
                        onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.signUpButtonText}>계정 생성</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.linkTextContainer}>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>
                            비밀번호를 잊으셨나요?
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.BG,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
        },
        textInput: {
            color: theme.TEXT,
            borderBottomColor: baseColors.GRAY_1,
            fontFamily: 'NanumGothic',
            fontSize: 14,
            width: '100%',
            borderBottomWidth: 1,
            padding: 6,
            marginStart: 20,
            marginEnd: 20,
            marginBottom: 10,
            backgroundColor: 'transparent',
        },
        autoLoginContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            marginTop: 10,
            marginBottom: 10,
        },
        checkboxLabel: {
            color: theme.TEXT_SECONDARY,
            fontSize: 14,
            fontFamily: 'NanumGothic',
            marginLeft: 16,
        },
        loginButtonContainer: {
            width: '100%',
            marginStart: 20,
            marginEnd: 20,
            marginTop: 20,
            marginBottom: 10,
        },
        loginButton: {
            backgroundColor: theme.BUTTON_BG,
            padding: 18,
            alignItems: 'center',
            borderRadius: 5,
        },
        loginButtonText: {
            color: theme.BUTTON_TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
        signUpButtonContainer: {
            width: '100%',
            marginStart: 20,
            marginEnd: 20,
            marginBottom: 10,
        },
        signUpButton: {
            backgroundColor: theme.BUTTON_SECONDARY_BG,
            padding: 18,
            alignItems: 'center',
            borderRadius: 5,
        },
        signUpButtonText: {
            color: theme.BUTTON_SECONDARY_TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
        linkTextContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
        },
        linkText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
    })

export default Login

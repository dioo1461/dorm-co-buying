import { requestLogin } from '@/apis/auth/loginAxiosRequests'
import { baseColors } from '@/constants/colors'
import { AppContext } from '@/hooks/contexts/AppContext'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import React, { useContext } from 'react'
import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Login = () => {
    const [id, setId] = React.useState('')
    const { themeColor } = useContext(AppContext)
    const [password, setPassword] = React.useState('')
    const [isAutoLogin, setIsAutoLogin] = React.useState(false)
    const navigation = stackNavigation()

    const handleLogin = async () => {
        const loginForm = {
            username: id,
            password: password,
        }
        const result = await requestLogin(loginForm)
        if (result) {
        } else {
        }
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
                <Image source={require('@/res/drawable/login_logo.png')} />
            </View>
            <View
                style={{
                    flex: 5,
                    alignItems: 'center',
                    width: '100%',
                }}>
                <TextInput
                    style={styles.input}
                    placeholder='아이디'
                    value={id}
                    onChangeText={setId}
                />
                <TextInput
                    style={styles.input}
                    placeholder='비밀번호'
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <View style={styles.autoLoginContainer}>
                    <View style={{ width: '5%' }}>
                        <BouncyCheckbox
                            size={25}
                            fillColor={themeColor.ICON_BG}
                            onPress={() => setIsAutoLogin(!isAutoLogin)}
                        />
                    </View>
                    <View>
                        <Text style={styles.checkboxLabel}>자동 로그인</Text>
                    </View>
                </View>
                <View style={styles.loginButtonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.loginButton,
                            {
                                backgroundColor: themeColor.ICON_BG,
                            },
                        ]}
                        onPress={handleLogin}>
                        <Text
                            style={{
                                fontSize: 16,
                                color: themeColor.ICON_TEXT,
                            }}>
                            로그인
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.signUpButtonContainer]}>
                    <TouchableOpacity
                        style={styles.signUpButton}
                        onPress={handleForgotPassword}>
                        <Text
                            style={{
                                fontSize: 16,
                            }}>
                            계정 생성
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.linkTextContainer}>
                    <TouchableOpacity>
                        <Text>비밀번호를 잊으셨나요?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    input: {
        width: '90%',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        padding: 10,
        marginStart: 20,
        marginEnd: 20,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: 'transparent',
    },
    autoLoginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        marginTop: 10,
        marginBottom: 10,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 16,
    },
    checkBox: {
        backgroundColor: 'transparent',
        width: '75%',
        height: '75%',
        borderWidth: 0,
        padding: 0,
    },
    loginButtonContainer: {
        width: '90%',
        marginStart: 20,
        marginEnd: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    loginButton: {
        padding: 20,
        alignItems: 'center',
        borderRadius: 5,
    },
    signUpButtonContainer: {
        width: '90%',
        marginStart: 20,
        marginEnd: 20,
        marginBottom: 10,
    },
    signUpButton: {
        padding: 20,
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: baseColors.GRAY_1,
    },
    linkTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
})

export default Login

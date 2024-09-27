import { darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { RouteProp } from '@react-navigation/native'
import React, { useEffect } from 'react'
import {
    Appearance,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { RootStackParamList } from '../navigation/NativeStackNavigation'

const SignUp7: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor, onLogInSuccess, onLoginFailure } =
        useBoundStore(state => ({
            themeColor: state.themeColor,
            setThemeColor: state.setThemeColor,
            onLogInSuccess: state.onLogInSuccess,
            onLoginFailure: state.onLoginFailure,
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

    type SignUp7RouteProp = RouteProp<RootStackParamList, 'SignUp7'>

    const handleLogin = async () => {
        onLogInSuccess()
    }

    return (
        <View style={styles.container}>
            <Text
                style={
                    styles.title1
                }>{`한바구니에 오신 것을\n환영합니다!`}</Text>
            <Text style={styles.subtitle}>
                {`본인 및 학교 인증 후\n한바구니의 서비스를 모두 이용하실 수 있습니다.`}
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>시작하기</Text>
            </TouchableOpacity>
        </View>
    )
}
const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingTop: 24,
            backgroundColor: theme.BG,
        },
        backButton: {
            position: 'absolute',
            top: 50,
            left: 20,
        },
        title1: {
            color: theme.TEXT,
            fontSize: 24,
            fontFamily: 'NanumGothic',
            textAlign: 'center',
            lineHeight: 30,
            marginBottom: 32,
        },
        subtitle: {
            color: theme.TEXT_SECONDARY,
            fontSize: 16,
            fontFamily: 'NanumGothic',
            lineHeight: 24,
            textAlign: 'center',
            marginBottom: 60,
        },
        button: {
            backgroundColor: theme.BUTTON_BG,
            paddingVertical: 15,
            paddingHorizontal: 50,
            borderRadius: 5,
            alignItems: 'center',
        },
        buttonText: {
            color: theme.BUTTON_TEXT,
            fontSize: 16,
        },
    })

export default SignUp7

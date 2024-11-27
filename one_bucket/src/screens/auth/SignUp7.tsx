import { Icolor } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { RouteProp, useRoute } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RootStackParamList } from '../navigation/NativeStackNavigation'

const SignUp7: React.FC = (): React.JSX.Element => {
    const { themeColor, onLogInSuccess, onLoginFailure } = useBoundStore(
        state => ({
            themeColor: state.themeColor,
            onLogInSuccess: state.onLogInSuccess,
            onLoginFailure: state.onLoginFailure,
        }),
    )

    const styles = createStyles(themeColor)

    type SignUp7RouteProp = RouteProp<RootStackParamList, 'SignUp7'>
    const { params } = useRoute<SignUp7RouteProp>()

    const handleLogin = async () => {
        onLogInSuccess(params.accessToken)
    }

    return (
        <View style={styles.container}>
            <Text
                style={
                    styles.title1
                }>{`한바구니에 오신 것을\n환영합니다!`}</Text>
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

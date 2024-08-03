import IcArrowLeft from '@/assets/drawable/ic-arrow-left.svg'
import { baseColors, lightColors } from '@/constants/colors'
import { AppContext } from '@/hooks/useContext/AppContext'
import { setAccessToken } from '@/utils/accessTokenMethods'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useContext } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RootStackParamList } from '../navigation/NativeStackNavigation'
const SignUp7: React.FC = (): React.JSX.Element => {
    const navigation = useNavigation()
    const { onLogInSuccess, onLoginFailure } = useContext(AppContext)
    type SignUp7RouteProp = RouteProp<RootStackParamList, 'SignUp7'>
    const { params } = useRoute<SignUp7RouteProp>()

    const handleLogin = async () => {
        await setAccessToken(params.accessToken)
        onLogInSuccess()
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}>
                <IcArrowLeft />
            </TouchableOpacity>
            <Text
                style={
                    styles.title1
                }>{`한바구니의 회원이 되신 것을\n진심으로 환영합니다!`}</Text>
            <Text style={styles.subtitle}>
                {`이제 한바구니의 서비스를 모두\n이용하실 수 있습니다.`}
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>시작하기</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 20,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
    },
    title1: {
        fontSize: 24,
        color: 'black',
        fontFamily: 'NanumGothic',
        textAlign: 'center',
        lineHeight: 30,
        marginBottom: 30,
    },
    subtitle: {
        fontSize: 16,
        color: baseColors.GRAY_1,
        fontFamily: 'NanumGothic',
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        backgroundColor: lightColors.ICON_BG,
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
})

export default SignUp7

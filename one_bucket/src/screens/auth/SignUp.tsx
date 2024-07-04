import { signUpHeaderStyles } from '@/styles/signUp/signUpHeaderStyles'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

const SignUp = () => {
    const navigation = useNavigation()

    return (
        <View style={signUpHeaderStyles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={signUpHeaderStyles.backButton}>
                <Image
                    source={require('@/assets/drawable/ic-arrow-outline.png')}
                />
            </TouchableOpacity>
            <View>
                <Text style={signUpHeaderStyles.currentStep}>1. 본인 인증</Text>
                <Text style={signUpHeaderStyles.title}>
                    {`한바구니를 이용하기 위해\n본인인증이 필요해요.`}
                </Text>
                <Text style={signUpHeaderStyles.subStep}>2. 학교 인증</Text>
                <Text style={signUpHeaderStyles.subStep}>
                    3. 이메일 및 비밀번호 설정
                </Text>
                <Text style={signUpHeaderStyles.subStep}>
                    4. 프로필 정보 입력
                </Text>
                <Text style={styles.phoneLabel}>휴대폰 번호 입력</Text>
            </View>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="'-' 없이 입력"
                    keyboardType='number-pad'
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('SignUp_2')}>
                    <Text style={styles.buttonText}>인증번호 발송</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    phoneLabel: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'NanumGothic-Bold',
        marginTop: 30,
        marginBottom: 10,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingBottom: 8,
        fontSize: 16,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#0A3D62',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
})

export default SignUp

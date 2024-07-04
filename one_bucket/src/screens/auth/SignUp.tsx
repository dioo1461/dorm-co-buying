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

const SignUpScreen = () => {
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}>
                <Image
                    source={require('@/assets/drawable/ic-arrow-outline.png')}
                />
            </TouchableOpacity>
            <Text style={styles.step}>1. 본인 인증</Text>
            <Text style={styles.title}>
                {`한바구니를 이용하기 위해\n본인인증이 필요해요.`}
            </Text>
            <Text style={styles.subStep}>2. 학교 인증</Text>
            <Text style={styles.subStep}>3. 이메일 및 비밀번호 설정</Text>
            <Text style={styles.subStep}>4. 프로필 정보 입력</Text>
            <Text style={styles.phoneLabel}>휴대폰 번호 입력</Text>
            <TextInput
                style={styles.input}
                placeholder="'-' 없이 입력"
                keyboardType='phone-pad'
            />
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>인증번호 발송</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        backgroundColor: 'white',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    step: {
        marginTop: 60,
        color: 'blue',
        fontSize: 16,
        fontFamily: 'NanumGothic',
        marginBottom: 10,
    },
    title: {
        fontSize: 30,
        color: 'black',
        fontFamily: 'NanumGothic',
        marginBottom: 20,
    },
    subStep: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
    },
    phoneLabel: {
        fontSize: 18,
        fontWeight: 'bold',
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
        fontWeight: 'bold',
    },
})

export default SignUpScreen

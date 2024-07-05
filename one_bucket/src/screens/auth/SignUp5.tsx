import { lightColors } from '@/constants/colors'
import { signUpHeaderStyles } from '@/styles/signUp/signUpHeaderStyles'
import { StringFilter } from '@/utils/StringFilter'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

const SignUp5 = () => {
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleEmailChange = (text: string) => {
        const cleaned = StringFilter.sqlFilter(text)
        setEmail(cleaned)
    }

    const handleEmailSubmit = () => {
        if (validateEmail(email) === true) {
            navigation.navigate('SignUp6', {
                email: email,
                password: password,
            })
        } else {
            Alert.alert('유효한 메일 주소를 입력해주세요.')
        }
    }

    const validateEmail = (number: string) => {
        // TODO : 이메일 validation 구현
        return true
    }

    return (
        <KeyboardAvoidingView
            style={signUpHeaderStyles.container}
            behavior={Platform.OS === 'android' ? 'position' : 'padding'}>
            <View>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                        navigation.goBack()
                    }}
                    style={signUpHeaderStyles.backButton}>
                    <Image
                        source={require('@/assets/drawable/ic-arrow-outline.png')}
                    />
                </TouchableOpacity>
            </View>
            <View>
                <View style={signUpHeaderStyles.headerContainer}>
                    <Text style={signUpHeaderStyles.subStep}>1. 본인 인증</Text>
                    <Text style={signUpHeaderStyles.subStep}>2. 학교 인증</Text>
                    <Text style={signUpHeaderStyles.currentStep}>
                        3. 이메일 및 비밀번호 설정
                    </Text>
                    <Text style={signUpHeaderStyles.title}>
                        {`로그인 시 사용할 이메일과\n비밀번호를 설정해 주세요.`}
                    </Text>
                    <Text style={signUpHeaderStyles.subStep}>
                        4. 프로필 정보 입력
                    </Text>
                </View>
                <View>
                    <Text style={styles.label}>로그인 이메일 주소 입력</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={handleEmailChange}
                        value={email}
                        placeholder='이메일'
                        keyboardType='email-address'
                    />
                    <Text style={styles.label}>비밀번호 입력</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={() => setPassword(password)}
                        placeholder='비밀번호'
                        keyboardType='default'
                        secureTextEntry={true}
                        scrollEnabled={false}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleEmailSubmit}>
                        <Text style={styles.buttonText}>다음</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'NanumGothic-Bold',
        marginTop: 30,
        marginBottom: 10,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingBottom: 4,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: lightColors.ICON_BG,
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
})

export default SignUp5

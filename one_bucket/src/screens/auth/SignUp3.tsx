import { lightColors } from '@/constants/colors'
import { signUpHeaderStyles } from '@/styles/signUp/signUpHeaderStyles'
import { StringFilter } from '@/utils/StringFilter'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

const SignUp3: React.FC = (): React.JSX.Element => {
    const navigation = useNavigation()
    const [schoolEmail, setSchoolEmail] = useState('')

    const handleSchoolEmailChange = (text: string) => {
        const cleaned = StringFilter.sqlFilter(text)
        setSchoolEmail(cleaned)
    }

    const handleSchoolEmailSubmit = () => {
        if (validateEmail(schoolEmail) === true) {
            navigation.navigate('SignUp4', {
                schoolEmail: schoolEmail,
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
        <ScrollView style={signUpHeaderStyles.container}>
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
            <View style={signUpHeaderStyles.headerContainer}>
                <Text style={signUpHeaderStyles.subStep}>1. 본인 인증</Text>
                <Text style={signUpHeaderStyles.currentStep}>2. 학교 인증</Text>
                <Text style={signUpHeaderStyles.title}>
                    {`이용자님의 재학생 여부를\n인증해 주세요.`}
                </Text>
                <Text style={signUpHeaderStyles.subStep}>
                    3. 이메일 및 비밀번호 설정
                </Text>
                <Text style={signUpHeaderStyles.subStep}>
                    4. 프로필 정보 입력
                </Text>
            </View>
            <View>
                <Text style={styles.schoolEmailLabel}>
                    학교 이메일 주소 입력
                </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={handleSchoolEmailChange}
                    value={schoolEmail}
                    placeholder='B912345@mail.hongik.ac.kr'
                    keyboardType='email-address'
                    autoFocus={true}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSchoolEmailSubmit}>
                    <Text style={styles.buttonText}>인증 코드 발송</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    schoolEmailLabel: {
        fontSize: 18,
        color: 'black',
        alignSelf: 'center',
        fontFamily: 'NanumGothic-Bold',
        marginTop: 30,
        marginBottom: 10,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingBottom: 4,
        fontSize: 16,
        marginBottom: 30,
    },
    button: {
        backgroundColor: lightColors.ICON_BG,
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
})

export default SignUp3

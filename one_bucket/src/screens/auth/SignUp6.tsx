import { submitSignupForm } from '@/apis/authService'
import { baseColors, lightColors } from '@/constants/colors'
import { AppContext } from '@/hooks/contexts/AppContext'
import { signUpHeaderStyles } from '@/styles/signUp/signUpHeaderStyles'
import { StringFilter } from '@/utils/StringFilter'
import CheckBox from '@react-native-community/checkbox'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useContext, useState } from 'react'
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { RootStackParamList } from '../navigation/NativeStackNavigation'

const SignUp6: React.FC = (): React.JSX.Element => {
    const navigation = useNavigation()
    const [nickName, setNickName] = useState('')
    const [bio, setBio] = useState('')
    const [isDormitory, setIsDormitory] = useState(false)

    const { onSignUpFailure } = useContext(AppContext)

    type SignUp6RouteProp = RouteProp<RootStackParamList, 'SignUp6'>
    const { params } = useRoute<SignUp6RouteProp>()

    const handleNickNameChange = (text: string) => {
        const cleaned = StringFilter.sqlFilter(text)
        setNickName(cleaned)
    }

    const handleFormSubmit = async () => {
        const signUpForm = {
            username: params.email,
            password: params.password,
            nickname: nickName,
        }
        const result = await submitSignupForm(signUpForm)
        if (result) {
            navigation.navigate('SignUp7', {
                email: params.email,
                password: params.password,
            })
        } else {
            onSignUpFailure()
        }
    }

    return (
        <KeyboardAvoidingView
            style={signUpHeaderStyles.container}
            behavior={Platform.OS === 'android' ? 'position' : 'padding'}>
            <View>
                <TouchableOpacity
                    onPress={() => {
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
                    <Text style={signUpHeaderStyles.subStep}>
                        3. 이메일 및 비밀번호 설정
                    </Text>
                    <Text style={signUpHeaderStyles.currentStep}>
                        4. 프로필 정보 입력
                    </Text>
                    <Text style={signUpHeaderStyles.title}>
                        {`이용자님의 프로필 정보를\n입력해 주세요.`}
                    </Text>
                </View>
                <ScrollView>
                    <Text style={styles.label}>닉네임 입력</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={handleNickNameChange}
                        value={nickName}
                        placeholder='닉네임'
                        keyboardType='default'
                    />
                    <Text style={styles.label}>자기소개</Text>
                    <TextInput
                        style={styles.bioInput}
                        onChangeText={() => setBio(bio)}
                        placeholder='간단한 자기소개 글을 작성해 주세요.'
                        keyboardType='default'
                        multiline={true}
                        numberOfLines={3}
                    />
                    <TouchableOpacity
                        onPress={() => setIsDormitory(!isDormitory)}
                        style={styles.dormContainer}>
                        <CheckBox
                            disabled={false}
                            value={isDormitory}
                            onValueChange={newVal => setIsDormitory(newVal)}
                            tintColors={{
                                true: baseColors.SCHOOL_BG,
                                false: baseColors.GRAY_1,
                            }}
                        />
                        <Text style={styles.dormText}>
                            기숙사에 거주 중이신가요?
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleFormSubmit}>
                        <Text style={styles.buttonText}>완료</Text>
                    </TouchableOpacity>
                </ScrollView>
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
    bioInput: {
        borderColor: baseColors.GRAY_1,
        borderWidth: 1,
        borderRadius: 5,
        textAlignVertical: 'top',
        fontSize: 14,
        marginBottom: 10,
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
    dormContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dormText: {
        fontSize: 16,
        color: 'black',
    },
})

export default SignUp6

import IcArrowLeft from '@/assets/drawable/ic-arrow-left.svg'
import IcRefresh from '@/assets/drawable/ic-refresh.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createSignUpStyles } from '@/styles/signUp/signUpStyles'
import { StringFilter } from '@/utils/StringFilter'
import React, { useEffect, useState } from 'react'
import {
    Alert,
    Appearance,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import { stackNavigation } from '../navigation/NativeStackNavigation'
import { NewPwRequestBody } from '@/data/request/signUpRequestBody'
import { postNewPwForm } from '@/apis/authService'

const NewPw: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
        setThemeColor: state.setThemeColor,
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
    const signUpStyles = createSignUpStyles(themeColor)
    const navigation = stackNavigation()
    const [id, setId] = useState('')
    const [myEmail, setMyEmail] = useState('')
    const [buttonText, setButtonText] = useState('새 비밀번호 발급 요청')

    const handleIdChange = (text: string) => {
        const cleaned = StringFilter.sqlFilter(text)
        setId(cleaned)
    }

    const handleEmailChange = (text: string) => {
        const cleaned = StringFilter.sqlFilter(text)
        setMyEmail(cleaned)
    }

    const handleSubmit = async () => {
        if (!validateInfo(myEmail)) {
            Alert.alert('형식에 맞는 메일 주소를 입력해주세요.')
            setButtonText('새 비밀번호 발급 요청')
            return
        }

        const form: NewPwRequestBody = {
            username: id,
            email: myEmail,
        }
        postNewPwForm(form)
            .then(res => {
                navigation.navigate('NewPw2',{ email: myEmail})
            })
            .catch(err => {
                setButtonText('새 비밀번호 발급 요청')
                console.log(`FindPw - submitSignUpForm: ${err}`)
                {/* if (err.response.status === 409) {
                    if (err.response.data.code == 1000) {
                        setEmailError(
                            signUpErrorMessage.duplicatedEmailOrNickname,
                        )
                        setNicknameError(
                            signUpErrorMessage.duplicatedEmailOrNickname,
                        )
                    }
                } */}
            }   
                )
    }
    
    const validateInfo = (email: string) => {
        return true
    }

    return (
        <ScrollView style={signUpStyles.container}>
            <View>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={signUpStyles.backButton}>
                    <IcArrowLeft />
                </TouchableOpacity>
                <View style={styles.verificationContainer}>
                <Text style={styles.infoText}>
                    계정의 비밀번호를 새로 발급받을 수 있습니다.
                </Text>
                </View>
                <Text style={styles.schoolInfoLabel}>
                    아이디 입력
                </Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={handleIdChange}
                    value={id}
                    placeholder='비밀번호를 분실한 아이디를 입력해 주세요.'
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                    autoFocus={true}
                />
                <Text style={styles.schoolInfoLabel}>
                    본인 이메일 주소 입력
                </Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={handleEmailChange}
                    value={myEmail}
                    placeholder='새로운 비밀번호를 받을 이메일을 입력해 주세요.'
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                    keyboardType='email-address'
                    autoFocus={true}
                />
                <TouchableOpacity
                    disabled={
                        !!(
                            !id ||
                            !myEmail
                        )
                    }
                    style={[
                        {
                            backgroundColor:
                                !id ||
                                !myEmail
                                    ? baseColors.GRAY_2
                                    : baseColors.SCHOOL_BG,
                        },
                    styles.button,
                    ]}
                    onPress={()=>{
                        setButtonText('잠시만 기다려 주세요...')
                        handleSubmit()
                    }}>
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        schoolInfoLabel: {
            fontSize: 18,
            color: theme.TEXT,
            fontFamily: 'NanumGothic-Bold',
            alignSelf: 'center',
            marginTop: 30,
            marginBottom: 10,
        },
        verificationContainer: {
            marginVertical: 20,
            alignItems: 'center',
        },
        infoText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
        textInput: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic',
            borderBottomWidth: 1,
            borderBottomColor: 'gray',
            paddingBottom: 4,
            marginBottom: 30,
        },
        button: {
            paddingVertical: 15,
            borderRadius: 5,
            alignItems: 'center',
        },
        buttonText: {
            color: theme.BUTTON_TEXT,
            fontSize: 16,
        },
    })

export default NewPw
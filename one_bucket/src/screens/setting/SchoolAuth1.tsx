import IcArrowLeft from '@/assets/drawable/ic-arrow-left.svg'
import IcRefresh from '@/assets/drawable/ic-refresh.svg'
import IcSelectArrow from '@/assets/drawable/ic-select-arrow.svg'
import IcSelectClose from '@/assets/drawable/ic-select-close.svg'
import IcSelectSearch from '@/assets/drawable/ic-select-search.svg'
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
import { SelectList } from 'react-native-dropdown-select-list'
import { schoolNames } from '@/screens/setting/SchoolNames'
import Toast from 'react-native-toast-message'
import { stackNavigation } from '../navigation/NativeStackNavigation'
import { SchoolAuthRequestBody } from '@/data/request/signUpRequestBody'
import { postSchoolForm } from '@/apis/authService'

const SchoolAuth1: React.FC = (): React.JSX.Element => {
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
    const [schoolName, setSchoolName] = useState('')
    const [schoolEmail, setSchoolEmail] = useState('')
    const [buttonText, setButtonText] = useState('인증 코드 발송')

    const handleSchoolNameChange = (text: string) => {
        const cleaned = StringFilter.sqlFilter(text)
        setSchoolName(cleaned)
    }

    const handleSchoolEmailChange = (text: string) => {
        const cleaned = StringFilter.sqlFilter(text)
        setSchoolEmail(cleaned)
    }

    const handleSchoolInfoSubmit = () => {
        if (validateInfo(schoolEmail) === true) {
            navigation.navigate('SchoolAuth2', {
                schoolName: schoolName,
                schoolEmail: schoolEmail,
            })
        } else {
            Alert.alert('유효한 메일 주소를 입력해주세요.')
        }
    }

    const handleSubmit = async () => {
        if (!validateInfo(schoolEmail)) {
            Alert.alert('형식에 맞는 메일 주소를 입력해주세요.')
            setButtonText('인증 코드 발송')
            return
        }

        const form: SchoolAuthRequestBody = {
            university: schoolName,
            universityEmail: schoolEmail,
        }
        postSchoolForm(form)
            .then(res => {
                navigation.navigate('SchoolAuth2', {
                    schoolName: schoolName,
                    schoolEmail: schoolEmail
                })
            })
            .catch(err => {
                setButtonText('인증 코드 발송')
                console.log(`SchoolAuth1 - submitSignUpForm: ${err}`)
                if(err.response.status === 409){
                    Alert.alert('이미 해당 메일로 인증한 계정이 존재합니다.')
                }
                {/*
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
        if(email.indexOf('@') == -1)
            return false
        else return true
    }

    return (
        <ScrollView style={signUpStyles.container}>
            <View>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={signUpStyles.backButton}>
                    <IcArrowLeft />
                </TouchableOpacity>
                <Text style={styles.schoolInfoLabel}>
                    학교 선택
                </Text>
                <SelectList
                    setSelected={setSchoolName}
                    data={schoolNames}
                    save="value"
                    placeholder={"본인의 학교를 선택해 주세요."}
                    searchPlaceholder={"학교 이름 검색"}
                    notFoundText={"일치하는 결과 없음"}
                    inputStyles={styles.textSelect}
                    arrowicon={<IcSelectArrow />}
                    closeicon={<IcSelectClose />}
                    searchicon={<IcSelectSearch />}
                />
                <Text style={styles.schoolInfoLabel}>
                    학교 이메일 주소 입력
                </Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={handleSchoolEmailChange}
                    value={schoolEmail}
                    placeholder='ex) B912345@mail.hongik.ac.kr'
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                    keyboardType='email-address'
                    autoFocus={true}
                />
                <TouchableOpacity
                    disabled={
                        !!(
                            !schoolName ||
                            !schoolEmail
                        )
                    }
                    style={[
                        {
                            backgroundColor:
                                !schoolName ||
                                !schoolEmail
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
            marginBottom: 30,
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
        textSelect: {
            color: theme.TEXT,
            fontSize: 16,
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

export default SchoolAuth1
import { postProfile, updateProfileImage } from '@/apis/profileService'
import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import { CachedImage } from '@/components/CachedImage'
import { baseColors, Icolor, lightColors } from '@/constants/colors'
import { AddProfileRequestBody } from '@/data/request/AddProfileRequestBody'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import { createSignUpStyles } from '@/styles/signUp/signUpStyles'
import { StringFilter } from '@/utils/StringFilter'
import CheckBox from '@react-native-community/checkbox'
import React, { useLayoutEffect, useState } from 'react'
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import IcPlus from '@/assets/drawable/ic-plus.svg'
import strings from '@/constants/strings'
import { SelectableBottomSheet } from '@/components/bottomSheet/SelectableBottomSheet'
import {
    ImageLibraryOptions,
    launchImageLibrary,
} from 'react-native-image-picker'
import BaseProfileImage from '@/assets/drawable/base-profile-image.svg'

const Profile: React.FC = (): React.JSX.Element => {
    const { themeColor, profile } = useBoundStore(state => ({
        themeColor: state.themeColor,
        profile: state.profile,
    }))

    const styles = createStyles(themeColor)
    const signUpStyles = createSignUpStyles(themeColor)
    const navigation = stackNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, [navigation])

    // ########## 상태 관리 변수 ##########

    const [imageUri, setImageUri] = useState<string>('')
    const [bottomSheetEnabled, setBottomSheetEnabled] = useState(false)

    const getYear = (raw: any) => {
        const date = new Date(raw)
        const year = String(date.getFullYear())
        return year
    }
    const getMonth = (raw: any) => {
        const date = new Date(raw)
        const month = String(date.getMonth() + 1).padStart(2, '0')
        return month
    }
    const getDay = (raw: any) => {
        const date = new Date(raw)
        const day = String(date.getDate()).padStart(2, '0')
        return day
    }
    const getGender = (gender: any) => {
        if (gender == 'man') return true
        else return false
    }

    const [name, setName] = useState(profile!.name)
    const [male, setMale] = useState(getGender(profile!.gender))
    const gender = male == true ? 'man' : 'woman'
    const [year, setYear] = useState(getYear(profile!.birth))
    const [month, setMonth] = useState(getMonth(profile!.birth))
    const [day, setDay] = useState(getDay(profile!.birth))
    const [age, setAge] = useState(0)
    const birth = String(
        year +
            '-' +
            String(month).padStart(2, '0') +
            '-' +
            String(day).padStart(2, '0'),
    )
    const [bio, setBio] = useState(String(profile!.description))

    const handleNameChange = (text: string) => {
        const cleaned = StringFilter.sqlFilter(text)
        setName(cleaned)
    }

    const onImageAddButtonPress = () => {
        setBottomSheetEnabled(true)
    }

    const addImageFromGallery = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: 10 - imageUri.length,
        }
        setBottomSheetEnabled(false)
        launchImageLibrary(options, response => {
            response.assets?.forEach(asset => {
                if (asset.uri) {
                    setImageUri(asset.uri)
                }
            })
        })
    }

    const handleSubmit = async () => {
        // const result = await submitSignupForm(signUpForm)
        const form: AddProfileRequestBody = {
            name: name,
            gender: gender,
            age: age,
            description: bio,
            birth: birth,
        }
        var imageFormData: FormData | null = new FormData()
        if (imageUri) {
            const filename = imageUri.split('/').pop() // 파일 이름 추출
            const fileExtension = filename!.split('.').pop() // 파일 확장자 추출
            // FormData에 파일 추가
            imageFormData.append('file', {
                uri: imageUri,
                name: filename, // 파일 이름
                type: `image/${fileExtension}`, // MIME 타입 설정
            })
        } else {
            imageFormData = null
        }

        console.log(imageFormData)
        console.log(imageFormData?.getParts())
        Promise.all([postProfile(form), updateProfileImage(imageFormData)])
            .then(res => {
                Toast.show({ text1: '프로필이 성공적으로 수정되었습니다.' })
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    navigation.goBack()
                }}
                style={signUpStyles.backButton}>
                <IcAngleLeft fill={baseColors.GRAY_2} />
            </TouchableOpacity>
            <ScrollView
                style={styles.scrollViewContainer}
                showsVerticalScrollIndicator={false}>
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.verificationContainer}>
                        <Text style={styles.infoText}>
                            입력했던 프로필을 수정할 수 있습니다.
                        </Text>
                    </View>
                    <TouchableOpacity onPress={onImageAddButtonPress}>
                        {imageUri ? (
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <BaseProfileImage width={138} height={138} />
                        )}
                        <View
                            style={{
                                width: 26,
                                height: 26,
                                backgroundColor: baseColors.GRAY_2,
                                borderRadius: 16,
                                position: 'absolute',
                                bottom: 26,
                                right: 0,
                                elevation: 3,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <IcPlus />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.label}>이름</Text>
                    <Text style={styles.accent}>*</Text>
                </View>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder='이름'
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                />
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.label}>성별</Text>
                    <Text style={styles.accent}>*</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => setMale(true)}
                        style={styles.dormContainer}>
                        <CheckBox
                            disabled={false}
                            value={male}
                            onValueChange={() => setMale(true)}
                            tintColors={{
                                true: baseColors.SCHOOL_BG,
                                false: baseColors.GRAY_1,
                            }}
                        />
                        <Text style={styles.dormText}>남성</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setMale(false)}
                        style={styles.dormContainer}>
                        <CheckBox
                            disabled={false}
                            value={!male}
                            onValueChange={() => setMale(false)}
                            tintColors={{
                                true: baseColors.SCHOOL_BG,
                                false: baseColors.GRAY_1,
                            }}
                        />
                        <Text style={styles.dormText}>여성</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.label}>생년월일</Text>
                    <Text style={styles.accent}>*</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        style={styles.birthInput}
                        value={year}
                        onChangeText={setYear}
                        placeholder='YYYY'
                        keyboardType='number-pad'
                        textAlign='center'
                        placeholderTextColor={themeColor.TEXT_SECONDARY}
                    />
                    <Text style={{ fontSize: 16, marginBottom: 16 }}> 년 </Text>
                    <TextInput
                        style={styles.birthInput}
                        value={month}
                        onChangeText={setMonth}
                        placeholder='MM'
                        keyboardType='number-pad'
                        textAlign='center'
                        placeholderTextColor={themeColor.TEXT_SECONDARY}
                    />
                    <Text style={{ fontSize: 16, marginBottom: 16 }}> 월 </Text>
                    <TextInput
                        style={styles.birthInput}
                        value={day}
                        onChangeText={setDay}
                        placeholder='DD'
                        keyboardType='number-pad'
                        textAlign='center'
                        placeholderTextColor={themeColor.TEXT_SECONDARY}
                    />
                    <Text style={{ fontSize: 16, marginBottom: 16 }}> 일 </Text>
                </View>
                <Text style={styles.label}>자기소개</Text>
                <TextInput
                    style={styles.bioInput}
                    value={bio}
                    onChangeText={setBio}
                    placeholder='간단한 자기소개를 작성해 주세요.'
                    keyboardType='default'
                    multiline={true}
                    numberOfLines={3}
                />
            </ScrollView>
            <TouchableOpacity
                style={{
                    ...styles.button,
                    backgroundColor:
                        !name || !year || !month || !day
                            ? baseColors.GRAY_2
                            : baseColors.SCHOOL_BG,
                }}
                disabled={!name || !year || !month || !day}
                onPress={handleSubmit}>
                <Text style={styles.buttonText}>수정하기</Text>
            </TouchableOpacity>
            <SelectableBottomSheet
                enabled={bottomSheetEnabled}
                theme={themeColor}
                onClose={() => setBottomSheetEnabled(false)}
                buttons={[
                    {
                        text: '갤러리에서 이미지 선택하기',
                        style: 'default',
                        onPress: addImageFromGallery,
                    },
                    {
                        text: '기본 이미지로 변경',
                        style: 'default',
                        onPress: () => {
                            setBottomSheetEnabled(false)
                            setImageUri('')
                        },
                    },
                ]}
            />
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollViewContainer: {
            paddingHorizontal: 20,
            marginBottom: 54,
        },
        infoText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
        verificationContainer: {
            marginVertical: 20,
            alignItems: 'center',
        },
        profileImage: {
            width: 120,
            height: 120,
            borderRadius: 60,
            marginBottom: 20,
        },
        label: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic-Bold',
            marginTop: 15,
            marginBottom: 10,
        },
        accent: {
            color: theme.ACCENT_TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic-Bold',
            marginTop: 15,
            marginBottom: 10,
        },
        input: {
            borderBottomWidth: 1,
            paddingBottom: 4,
            borderBottomColor: baseColors.GRAY_1,
            fontSize: 14,
            marginBottom: 20,
        },
        birthInput: {
            width: 50,
            height: 36,
            borderWidth: 1,
            borderRadius: 5,
            paddingBottom: 5,
            borderBottomColor: baseColors.GRAY_1,
            fontSize: 14,
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
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: lightColors.BUTTON_BG,
            paddingVertical: 18,
            alignItems: 'center',
        },
        buttonText: {
            color: 'white',
            fontSize: 16,
        },
        dormContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            padding: 10,
        },
        dormText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 16,
            marginBottom: 4,
        },
    })

export default Profile

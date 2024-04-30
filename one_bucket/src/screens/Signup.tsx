import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { View, TextInput, Button } from 'react-native'

const Signup = () => {
    const [id, setId] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [schoolName, setSchoolName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const navigation = stackNavigation()

    const handlePersonalVerification = () => {
        // Handle personal verification logic
    }

    const handleSchoolVerification = () => {
        // Handle school verification logic
    }

    return (
        <View>
            {/* Personal Verification */}
            <TextInput placeholder='아이디' value={id} onChangeText={setId} />
            <TextInput
                placeholder='비밀번호'
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                placeholder='전화번호'
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />

            {/* School Verification */}
            <TextInput
                placeholder='학교명'
                value={schoolName}
                onChangeText={setSchoolName}
            />
            <TextInput
                placeholder='학교 Email'
                value={email}
                onChangeText={setEmail}
            />
            <Button title='인증 코드 전송' onPress={handleSchoolVerification} />
            {/* Resend and Edit Buttons */}
            {/* Verification Code Input */}
            <TextInput
                placeholder='인증 코드'
                value={verificationCode}
                onChangeText={setVerificationCode}
            />
            <Button
                title='다음'
                onPress={() =>
                    navigation.navigate('SetProfile', {
                        id: id,
                        password: password,
                        phoneNumber: phoneNumber,
                        schoolName: schoolName,
                        email: email,
                    })
                }
            />
        </View>
    )
}

export default Signup

import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, TextInput, Button } from 'react-native'

const Signup = () => {
    const [phoneNumber, setPhoneNumber] = React.useState('')
    const [fullName, setFullName] = React.useState('')
    const [schoolName, setSchoolName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [verificationCode, setVerificationCode] = React.useState('')
    const navigation = useNavigation()

    const handlePersonalVerification = () => {
        // Handle personal verification logic
    }

    const handleSchoolVerification = () => {
        // Handle school verification logic
    }

    return (
        <View>
            {/* Personal Verification */}
            <TextInput
                placeholder='전화번호'
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />
            <TextInput
                placeholder='이름'
                value={fullName}
                onChangeText={setFullName}
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
                onPress={() => navigation.navigate('SetProfile', { id: 2 })}
            />
        </View>
    )
}

export default Signup

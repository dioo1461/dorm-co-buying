import React from 'react'
import {
    View,
    TextInput,
    Button,
    Image,
    TouchableOpacity,
    Text,
    Pressable,
    StyleSheet,
} from 'react-native'
import CheckBox from '@react-native-community/checkbox'

const SetProfile = () => {
    const [nickname, setNickname] = React.useState('')
    const [profilePicture, setProfilePicture] = React.useState<string | null>(
        null,
    ) // Store image URI
    const [bio, setBio] = React.useState('')
    const [isDorm, setIsDorm] = React.useState(false) // Default to false (not living in dorm)

    const handleProfileSetup = () => {
        // Handle profile setup logic
    }

    const toggleCheckbox = () => {
        setIsDorm(!isDorm)
    }

    return (
        <View style={styles.container}>
            <TextInput
                placeholder='Nickname'
                value={nickname}
                onChangeText={setNickname}
                style={styles.input}
            />
            {profilePicture && (
                <Image source={{ uri: profilePicture }} style={styles.image} />
            )}
            <TextInput
                placeholder='Bio'
                value={bio}
                onChangeText={setBio}
                style={styles.input}
            />
            <View style={{ flexDirection: 'row' }}>
                <CheckBox
                    disabled={false}
                    value={isDorm}
                    onValueChange={value => setIsDorm(value)}
                />
                <Text>기숙사생 여부</Text>
            </View>
            <Button title='Complete' onPress={handleProfileSetup} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '80%',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 10,
    },
    uploadText: {
        color: 'blue',
        marginBottom: 10,
    },
    checkbox: {
        alignSelf: 'center',
    },
})

export default SetProfile

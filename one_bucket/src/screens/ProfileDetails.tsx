import { useNavigation } from '@react-navigation/native'
import React from 'react'
import {
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const ProfileDetails: React.FC = (): React.JSX.Element => {
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}>
                <Image
                    source={require('@/assets/drawable/ic-angle-left.png')}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingTop: 20,
        backgroundColor: 'white',
    },
    backButton: {
        width: 24,
        height: 24,
        marginBottom: 20,
    },
})

export default ProfileDetails

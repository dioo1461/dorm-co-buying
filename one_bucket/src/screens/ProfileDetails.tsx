import { useNavigation } from '@react-navigation/native'
import React from 'react'
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
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
            <View style={styles.profileContainer}>
                <View style={styles.profileTextContainer}>
                    <Text style={styles.username}>홍길동</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 20,
        backgroundColor: 'white',
    },
    backButton: {
        width: 24,
        height: 24,
        marginTop: 10,
        marginBottom: 20,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'gray',
    },
    profileTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    username: {
        fontFamily: 'NanumGothic-Bold',
        fontSize: 18,
    },
})

export default ProfileDetails

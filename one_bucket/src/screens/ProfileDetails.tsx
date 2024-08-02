import { baseColors } from '@/constants/colors'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import {
    Dimensions,
    Image,
    ScrollView,
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
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('@/assets/drawable/ic-angle-left.png')}
                        style={styles.backButtonImage}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.headerContainer}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={require('@/assets/drawable/vector.png')}
                        style={styles.profileImage}
                    />
                    <Text style={styles.nicknameText}>홍길동</Text>
                </View>
                <View style={styles.bioContainer}>
                    <Image
                        source={require('@/assets/drawable/postit.png')}
                        style={styles.bioImage}
                    />
                </View>
            </View>
            <View style={styles.profilesContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <Text style={styles.profileLabel}>이름</Text>
                        <Text style={styles.profileContext}>ㅎㅇ</Text>
                        <Text style={styles.profileLabel}>성별</Text>
                        <Text style={styles.profileContext}>ㅎㅇ</Text>
                        <Text style={styles.profileLabel}>생년월일</Text>
                        <Text style={styles.profileContext}>ㅎㅇ</Text>
                        <Text style={styles.profileLabel}>학교명</Text>
                        <Text style={styles.profileContext}>ㅎㅇ</Text>
                        <Text style={styles.profileLabel}>학부</Text>
                        <Text style={styles.profileContext}>ㅎㅇ</Text>
                        <Text style={styles.profileLabel}>가입한 날짜</Text>
                        <Text style={styles.profileContext}>ㅎㅇ</Text>
                    </View>
                </ScrollView>
            </View>
            <View style={styles.profileModifyButtonContainer}>
                <TouchableOpacity style={styles.profileModifyButton}>
                    <Text style={styles.profileModifyButtonText}>
                        프로필 변경
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
        backgroundColor: 'white',
    },
    backButtonContainer: {
        flex: 1,
        marginTop: 10,
    },
    backButtonImage: {
        width: 24,
        height: 24,
    },
    headerContainer: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    profileImageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImage: {
        width: 84,
        height: 96,
        backgroundColor: 'gray',
        borderRadius: 50,
    },
    nicknameText: {
        fontFamily: 'NanumGothic-Bold',
        fontSize: 18,
        color: 'black',
        marginTop: 16,
    },
    bioContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    bioImage: {
        width: 159,
        height: 192,
    },
    profilesContainer: {
        flex: 8,
        backgroundColor: 'white',
        padding: 10,
        marginHorizontal: 16,
        borderRadius: 8,
        elevation: 3,
    },
    profileLabel: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'NanumGothic-Bold',
        marginTop: 10,
    },
    profileContext: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'NanumGothic-Bold',
        marginTop: 10,
        marginBottom: 16,
        marginStart: 12,
    },
    profileModifyButtonContainer: {
        flex: 2,
        justifyContent: 'center',
    },
    profileModifyButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: baseColors.SCHOOL_BG,
        borderRadius: 8,
        paddingVertical: 16,
        marginHorizontal: 4,
    },
    profileModifyButtonText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'NanumGothic',
        marginEnd: 6,
    },
})

export default ProfileDetails

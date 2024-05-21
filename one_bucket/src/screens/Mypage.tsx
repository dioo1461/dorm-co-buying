import { AppContext } from '@/hooks/contexts/AppContext'
import { useContext } from 'react'
import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Button,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const Mypage = (): React.JSX.Element => {
    const { onLogOut } = useContext(AppContext)
    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                {/* <Image
                    style={styles.profileImage}
                    source={require('path/to/default/profile/image.png')} // 프로필 이미지 경로
                /> */}
                <View style={styles.profileTextContainer}>
                    <Text style={styles.username}>user0123</Text>
                    <Text style={styles.userInfo}>거래 6건 · 친구 4명</Text>
                </View>
                <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.profileLink}>프로필 보기</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.payMoneyContainer}>
                <View style={styles.payMoneyTextContainer}>
                    <Text style={styles.payMoneyLabel}>페이머니</Text>
                    <Text style={styles.payMoneyAmount}>12,000</Text>
                </View>
                <View style={styles.payMoneyButtonsContainer}>
                    <TouchableOpacity style={styles.payMoneyButton}>
                        <Text style={styles.payMoneyButtonText}>+ 충전</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.payMoneyButton}>
                        <Text style={styles.payMoneyButtonText}>↻ 반환</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.activityContainer}>
                <Text style={styles.activityTitle}>나의 활동</Text>
                <TouchableOpacity style={styles.activityItem}>
                    <Icon name='favorite' size={24} color='black' />
                    <Text style={styles.activityText}>좋아요 누른 글</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.activityItem}>
                    <Icon name='description' size={24} color='black' />
                    <Text style={styles.activityText}>내가 쓴 글</Text>
                </TouchableOpacity>
            </View>
            <Button title='Logout' onPress={onLogOut} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#003366',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    userInfo: {
        fontSize: 14,
        color: 'gray',
    },
    profileLink: {
        color: 'gray',
    },
    payMoneyContainer: {
        backgroundColor: 'white',
        padding: 16,
        marginHorizontal: 16,
        borderRadius: 8,
        elevation: 3,
    },
    payMoneyTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    payMoneyLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    payMoneyAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    payMoneyButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    payMoneyButton: {
        backgroundColor: '#003366',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 8,
    },
    payMoneyButtonText: {
        color: 'white',
        fontSize: 16,
    },
    activityContainer: {
        backgroundColor: 'white',
        padding: 16,
        marginHorizontal: 16,
        borderRadius: 8,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#003366',
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 8,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    activityText: {
        fontSize: 16,
        marginLeft: 8,
    },
})

export default Mypage

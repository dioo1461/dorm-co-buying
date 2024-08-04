import IcAngleRight from '@/assets/drawable/ic-angle-right.svg'
import IcArrowCircle from '@/assets/drawable/ic-arrow-circle.svg'
import IcPlus from '@/assets/drawable/ic-plus.svg'
import { baseColors } from '@/constants/colors'
import strings from '@/constants/strings'
import { AppContext } from '@/hooks/useContext/AppContext'
import { queryGetMemberInfo } from '@/hooks/useQuery/profileQuery'
import { useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import {
    ActivityIndicator,
    Button,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const Mypage = (): React.JSX.Element => {
    // const [nickName, setNickName] = useState('')
    const { onLogOut } = useContext(AppContext)

    const { data, isLoading, error } = queryGetMemberInfo()
    const [memberInfo, profileImage] = data ? data : [null, null]

    const navigation = useNavigation()

    const handleProfileDetailNavigation = () => {
        navigation.navigate(strings.profileDetailsScreenName)
    }

    if (error) return <Text>Error...</Text>

    if (isLoading)
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <ActivityIndicator size='large' color={baseColors.SCHOOL_BG} />
            </View>
        )

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.profileTextContainer}>
                    {/* <CachedImage
                        imageStyle={{}}
                        image={data![1]}
                        imageId='profile2'
                    /> */}
                    <Text style={styles.username}>{memberInfo!.nickname}</Text>
                    <Text style={styles.userInfo}>거래 6건 · 친구 4명</Text>
                </View>
                <TouchableOpacity onPress={handleProfileDetailNavigation}>
                    <Text style={styles.profileLink}>프로필 보기</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.payMoneyContainer}>
                <View style={styles.payMoneyTextContainer}>
                    <Text style={styles.payMoneyLabel}>페이머니</Text>
                    <Text style={styles.payMoneyAmount}>12,000</Text>
                    <TouchableOpacity style={styles.payMoneyDetailsButton}>
                        <IcAngleRight fill={baseColors.GRAY_1} />
                    </TouchableOpacity>
                </View>
                <View style={styles.payMoneyButtonsContainer}>
                    <TouchableOpacity style={styles.payMoneyButton}>
                        <IcPlus style={styles.payMoneyButtonImage} />
                        <Text style={styles.payMoneyButtonText}>충전</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.payMoneyButton}>
                        <IcArrowCircle style={styles.payMoneyButtonImage} />
                        <Text style={styles.payMoneyButtonText}>반환</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.activityContainer}>
                <Text style={styles.activityTitle}>나의 활동</Text>
                <TouchableOpacity style={styles.activityItem}>
                    {/* <Icon name='favorite' size={24} color='black' /> */}
                    <Text style={styles.activityText}>좋아요 누른 글</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.activityItem}>
                    {/* <Icon name='description' size={24} color='black' /> */}
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
        backgroundColor: baseColors.SCHOOL_BG,
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
        color: 'black',
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
        padding: 10,
        marginHorizontal: 16,
        borderRadius: 8,
        elevation: 3,
    },
    payMoneyTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        marginBottom: 16,
    },
    payMoneyLabel: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'NanumGothic-Bold',
        color: 'black',
    },
    payMoneyAmount: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'NanumGothic-Bold',
        color: 'black',
    },
    payMoneyDetailsButton: {
        flex: 1,
        alignItems: 'flex-end',
        width: 20,
        height: 20,
    },
    payMoneyButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    payMoneyButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: baseColors.SCHOOL_BG,
        borderRadius: 8,
        paddingVertical: 10,
        marginHorizontal: 4,
    },
    payMoneyButtonImage: {
        height: 16,
        width: 16,
        marginEnd: 4,
    },
    payMoneyButtonText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'NanumGothic',
        marginEnd: 6,
    },
    activityContainer: {
        backgroundColor: 'white',
        padding: 16,
        marginHorizontal: 16,
        borderRadius: 8,
        marginTop: 16,
        borderWidth: 1,
        borderColor: baseColors.SCHOOL_BG,
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: baseColors.SCHOOL_BG,
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

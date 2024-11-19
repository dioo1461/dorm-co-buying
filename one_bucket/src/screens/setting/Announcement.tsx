import { Icolor } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    View,
} from 'react-native'

const Announcement: React.FC = (): React.JSX.Element => {
    const { themeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
    }))

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()

    const announcs = [
        [
            '한바구니 론-칭 기념 이벤트',
            '대상혁에게 쿠폰을 받아가세요!\n01053726732...(더보기)',
        ],
    ]

    const announcFrame = (data: any) => (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
                themeColor.BG_SECONDARY,
                false,
            )}>
            <View style={styles.announc}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={require('@/assets/drawable/vector.png')}
                        style={styles.announcIcon}
                    />
                    <View style={styles.announcTitle}>
                        <Text
                            style={{
                                ...styles.announcText,
                                fontWeight: 'bold',
                            }}>
                            {data.item[0]}
                        </Text>
                        <View style={styles.announcCont}>
                            <Text style={styles.announcText}>
                                {data.item[1]}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableNativeFeedback>
    )

    return (
        <View>
            <FlatList
                style={styles.announcList}
                data={announcs}
                renderItem={announcFrame}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )
}

const CreateStyles = (theme: Icolor) =>
    StyleSheet.create({
        announc: {
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            paddingVertical: 10,
        },
        announcText: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic',
        },
        announcTitle: {
            paddingHorizontal: 20,
        },
        announcCont: {
            justifyContent: 'space-between',
            paddingVertical: 10,
        },
        announcList: {},
        announcIcon: {
            height: 25,
            width: 25,
        },
    })

export default Announcement

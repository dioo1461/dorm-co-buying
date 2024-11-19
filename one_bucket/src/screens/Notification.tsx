import { Icolor } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    View,
} from 'react-native'
import { stackNavigation } from './navigation/NativeStackNavigation'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const notifs = [
    ['새로운 댓글', '수수수 수퍼노바'],
    ['내 공동구매 마감', '물티슈'],
    ['참여한 공동구매 마감', '두루마리 휴지'],
    ['공동구매 추천', '일회용 플라스틱 숟가락'],
]
export const notifsNum = notifs.length // mainRoutes에 import
const getNotifs = () => {
    // append.notifs
}

const Notification: React.FC = (): React.JSX.Element => {
    const { themeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
    }))

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()
    const notifsType = []

    const notifFrame = (data: any) => (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
                themeColor.BG_SECONDARY,
                false,
            )}>
            <View style={styles.notif}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/*
                    <IcNotification 
                        style={{ marginEnd: 8 }} 
                        fill='black'
                    />
                    */}
                    <Image
                        source={require('@/assets/drawable/vector.png')}
                        style={styles.notifIcon}
                    />
                    <View style={styles.notifTitle}>
                        <Text
                            style={{ ...styles.notifText, fontWeight: 'bold' }}>
                            {data.item[0]}
                        </Text>
                        <View style={styles.notifCont}>
                            <Text style={styles.notifText}>{data.item[1]}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableNativeFeedback>
    )

    return (
        <View>
            <FlatList
                style={styles.notifList}
                data={notifs}
                renderItem={notifFrame}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )
}

const CreateStyles = (theme: Icolor) =>
    StyleSheet.create({
        notif: {
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            paddingVertical: 10,
        },
        notifText: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic',
        },
        notifTitle: {
            paddingHorizontal: 20,
        },
        notifCont: {
            justifyContent: 'space-between',
            paddingVertical: 10,
        },
        notifList: {},
        notifIcon: {
            height: 25,
            width: 25,
        },
    })

export default Notification

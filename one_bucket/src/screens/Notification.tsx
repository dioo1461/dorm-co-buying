import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcClose from '@/assets/drawable/ic-close.svg'
import IcNotification from '@/assets/drawable/ic-angle-left.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useEffect } from 'react'
import {
    Appearance,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native'
import { stackNavigation } from './navigation/NativeStackNavigation'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const notifs = [
    '새로운 댓글',
    '내 공동구매 마감',
    '참여한 공동구매 마감',
    '공지사항',
]
export const notifsNum = notifs.length; // mainRoutes에 import
const getNotifs = () => {
    // append.notifs
}

const Notification: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
        setThemeColor: state.setThemeColor,
    }))
    // 다크모드 변경 감지
    useEffect(() => {
        const themeSubscription = Appearance.addChangeListener(
            ({ colorScheme }) => {
                setThemeColor(colorScheme === 'dark' ? darkColors : lightColors)
            },
        )
        return () => themeSubscription.remove()
    }, [])

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()
    const notifsType = [ ]

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
                            <Text style={{...styles.notifText, fontWeight: 'bold'}}>
                                {data.item}
                            </Text>
                        <View style={styles.notifCont}>
                            <Text style={styles.notifText}>
                                수수수 수퍼노바
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
        notifTitle:{
            paddingHorizontal: 20,
        },
        notifCont:{
            justifyContent: 'space-between',
            paddingVertical: 10,
        },
        notifList:{

        },
        notifIcon:{
            height: 25,
            width: 25,
        }
    })

export default Notification
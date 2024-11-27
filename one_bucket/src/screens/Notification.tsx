import { Icolor } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import {
    Dimensions,
    FlatList,
    Image,
    ListRenderItem,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    View,
} from 'react-native'
import { stackNavigation } from './navigation/NativeStackNavigation'
import useNotificationDB, {
    NotificationColumns,
} from '@/hooks/useDatabase/useNotificationDB'
import IcClose from '@/assets/drawable/ic-close.svg'
import { useEffect, useState } from 'react'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const Notification: React.FC = (): React.JSX.Element => {
    const { themeColor, setNewNotificationCount } = useBoundStore(state => ({
        themeColor: state.themeColor,
        setNewNotificationCount: state.setNewNotificationCount,
    }))

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()
    const [offset, setOffset] = useState(0)
    const [notificationList, setNotificationList] = useState<
        NotificationColumns[]
    >([])
    const { getNotifications, deleteNotification } = useNotificationDB()

    useEffect(() => {
        const init = async () => {
            setNotificationList(await getNotifications(10, 0))
            setOffset(10)
            setNewNotificationCount(0)
        }

        init()
    }, [])

    const renderItem: ListRenderItem<NotificationColumns> = ({ item }) => (
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
                        fill='black'a
                    />
                    */}
                    <Image
                        source={require('@/assets/drawable/vector.png')}
                        style={styles.notifIcon}
                    />
                    <View style={styles.notifTitle}>
                        <Text
                            style={{ ...styles.notifText, fontWeight: 'bold' }}>
                            {item.title}
                        </Text>
                        <View style={styles.notifCont}>
                            <Text style={styles.notifText}>{item.content}</Text>
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
                data={notificationList}
                renderItem={renderItem}
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

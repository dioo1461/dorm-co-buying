import messaging, {
    FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'
import notifee, {
    AndroidImportance,
    AndroidVisibility,
    AuthorizationStatus,
} from '@notifee/react-native'
import { submitFCMDeviceToken } from '@/apis/authService'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'

const TOPIC_ALL = 'ALL_USER'
const TOPIC_CHAT = ''

const initializeFcm = () => {
    const init = async () => {
        const channelIdAll = await notifee.createChannel({
            id: 'all',
            name: 'All Notifications',
        })

        const displayNotification = async (
            message: FirebaseMessagingTypes.RemoteMessage,
        ) => {
            console.log('message:', message)

            if (message.data === undefined) {
                console.log('FCM - message.data is undefined')
                return
            }

            await notifee.displayNotification({
                title: message.data.title as string,
                body: message.data.body as string,
                android: {
                    channelId: channelIdAll,
                    smallIcon: 'ic_launcher',
                    importance: AndroidImportance.HIGH,
                    visibility: AndroidVisibility.PUBLIC,
                },
            })
        }

        const requestNotificationPermission = async () => {
            // 사용자에게 알림 권한 허용을 요청한다, 설정된 권한 상태를 반환한다
            const settings = await notifee.requestPermission()

            // 권한 상태는 settings.authorizationStatus로 확인할 수 있다
            if (settings.authorizationStatus >= AuthorizationStatus.DENIED) {
                return true
            } else return false
        }

        const notificationHandler = async (
            remoteMessage: FirebaseMessagingTypes.RemoteMessage,
        ) => {
            console.log(remoteMessage)
            displayNotification(remoteMessage)
        }

        const backgroundMessageHandler = async (
            remoteMessage: FirebaseMessagingTypes.RemoteMessage,
        ) => {
            console.log('backgroundMessageHandler')
            displayNotification(remoteMessage)
        }

        // ########### MAIN ###########

        requestNotificationPermission()
        messaging().subscribeToTopic(TOPIC_ALL)
        messaging().onMessage(() => {
            console.log('onMessage')
        })
        messaging().setBackgroundMessageHandler(backgroundMessageHandler)

        // notifee.onBackgroundEvent(async ({ type, detail }) => {
        //     console.log('onBackgroundEvent:', type, detail)
        //     if (type === 'ACTION_PRESS') {
        //         if (detail.actionId === 'chat') {
        //             navigation.navigate('Chat')
        //         }
        //     }
        // })
    }

    init()
}

export default initializeFcm

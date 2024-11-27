import { FcmMessageData } from '@/data/response/success/fcm/FcmMessageData'
import notifee, {
    AndroidImportance,
    AndroidVisibility,
    AuthorizationStatus,
} from '@notifee/react-native'
import messaging, {
    FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'
import {
    getGlobalChatNotificationEnabled,
    getGlobalCommentNotificationEnabled,
    getPostNotificationEnabled,
} from './asyncStorageUtils'
import { openDatabase } from 'react-native-sqlite-storage'

const TOPIC_ALL = 'ALL_USER'

const initializeFcm = async () => {
    const init = async () => {
        const channelIdAll = await notifee.createChannel({
            id: 'all',
            name: 'All Notifications',
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
        })

        const displayNotification = async (
            message: FirebaseMessagingTypes.RemoteMessage,
        ) => {
            console.log('message:', message)
            if (message.data === undefined) {
                console.log('FCM - message.data is undefined')
                return
            }
            const data = message.data as unknown as FcmMessageData

            const channelId = data.type
            var notificationId = undefined

            switch (data.type) {
                case 'CHAT':
                    notificationId = 'chat-' + data.id
                    break
                case 'COMMENT':
                    notificationId = 'comment-' + data.id
                    break
                case 'TRADE':
                    notificationId = 'trade-' + data.id
                    break
                case 'ALL':
                    break
                case 'WARNING':
                    break
            }

            if (notificationId) {
                notifee.displayNotification({
                    id: notificationId,
                    title: data.title as string,
                    body: data.body as string,
                    android: {
                        channelId: channelIdAll,
                        smallIcon: 'ic_launcher',
                    },
                })
            } else {
                notifee.displayNotification({
                    title: data.title as string,
                    body: data.body as string,
                    android: {
                        channelId: channelIdAll,
                        smallIcon: 'ic_launcher',
                    },
                })
            }
        }

        const requestNotificationPermission = async () => {
            const settings = await notifee.requestPermission()
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

        const backgroundHandler = async (
            remoteMessage: FirebaseMessagingTypes.RemoteMessage,
        ) => {
            const data = remoteMessage.data as unknown as FcmMessageData
            var addToDB = true

            switch (data.type) {
                case 'CHAT':
                    if (!(await getGlobalChatNotificationEnabled())) return
                    break
                case 'COMMENT':
                    const [global, local] = await Promise.all([
                        getGlobalCommentNotificationEnabled(),
                        getPostNotificationEnabled(data.id),
                    ])
                    if (!global || !local) return
                    break
                case 'TRADE':
                    break
                case 'ALL':
                    break
                case 'WARNING':
                    break
            }

            if (addToDB)
                openDatabase(
                    { name: 'database.db', location: 'default' },
                    DB => {
                        console.log('[notificationDB] Database opened')
                        DB.transaction(
                            tx => {
                                // notification 테이블 생성 (없으면 생성)
                                tx.executeSql(
                                    `CREATE TABLE IF NOT EXISTS notification (
                                        tupleId INTEGER PRIMARY KEY AUTOINCREMENT,
                                        title TEXT,
                                        content TEXT,
                                        type TEXT,
                                        id TEXT
                                    );`,
                                    [],
                                    () => {
                                        console.log(
                                            '[notificationDB] Table created or already exists',
                                        )

                                        // remoteMessage에서 필요한 데이터 추출
                                        const notification = {
                                            id: remoteMessage.messageId,
                                            title:
                                                remoteMessage.notification
                                                    ?.title || '',
                                            content:
                                                remoteMessage.notification
                                                    ?.body || '',
                                            type: data.type,
                                        }

                                        // notification 테이블에 데이터 삽입
                                        tx.executeSql(
                                            `INSERT INTO notification (id, title, content, type) VALUES (?, ?, ?, ?)`,
                                            [
                                                notification.id,
                                                notification.title,
                                                notification.content,
                                                notification.type,
                                            ],
                                            (tx, results) => {
                                                console.log(
                                                    '[notificationDB] Notification inserted',
                                                )
                                            },
                                            error => {
                                                console.log(
                                                    '[notificationDB] Error inserting notification:',
                                                    error,
                                                )
                                            },
                                        )
                                    },
                                    error => {
                                        console.log(
                                            '[notificationDB] Error creating table:',
                                            error,
                                        )
                                    },
                                )
                            },
                            error => {
                                console.log(
                                    '[notificationDB] Transaction error:',
                                    error,
                                )
                            },
                        )
                    },
                    error => {
                        console.log(
                            '[notificationDB] Error opening database:',
                            error,
                        )
                    },
                )

            // 알림 표시
            displayNotification(remoteMessage)
        }

        // ########### MAIN ###########

        requestNotificationPermission()
        messaging().subscribeToTopic(TOPIC_ALL)
        messaging().onMessage(() => {
            console.log('onMessage')
        })
        messaging().setBackgroundMessageHandler(backgroundHandler)
    }

    init()
}

export default initializeFcm

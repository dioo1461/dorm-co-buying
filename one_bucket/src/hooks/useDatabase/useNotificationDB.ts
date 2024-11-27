import useDatabase from './useDatabase'

export type NotificationColumns = {
    title: string
    content: string
    type: string
    id: string
}

const useNotificationDB = () => {
    const { getDataByWhereClause, addData, deleteDataByKeys } =
        useDatabase<NotificationColumns>({
            tableName: 'notification',
            columns: {
                title: 'string',
                content: 'string',
                type: 'string',
                id: 'string',
            },
        })

    const addNotification = async (notification: NotificationColumns) => {
        await addData(notification)
    }

    const getNotifications = async (limit: number, offset: number) => {
        return await getDataByWhereClause(
            `WHERE true ORDER BY tupleId DESC LIMIT ${limit} OFFSET ${offset}`,
        )
    }

    const deleteNotification = async (notification: NotificationColumns) => {
        await deleteDataByKeys(notification)
    }

    return { addNotification, getNotifications, deleteNotification }
}

export default useNotificationDB

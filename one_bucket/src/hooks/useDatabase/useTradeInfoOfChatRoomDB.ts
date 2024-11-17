import { useEffect } from 'react'
import useDatabase, { ColumnTypes } from './useDatabase'

type TradeInfoOfChatRoom = {
    chatRoomId: string
    item: string
    wanted: number
    price: number
    count: number
    location: string
    linkUrl: string
    tag: string
    id: number
    userId: number
    dueDate: string
    joins: number
    nickNames: string[]
    startTradeAt: string
    fin: boolean
}

const useTradeInfoOfChatRoomDB = () => {
    const { getDataByKeys, addData, updateDataByKey } =
        useDatabase<TradeInfoOfChatRoom>({
            tableName: 'tradeInfoOfChatRoom',
            columns: {
                chatRoomId: 'string',
                item: 'string',
                wanted: 'number',
                price: 'number',
                count: 'number',
                location: 'string',
                linkUrl: 'string',
                tag: 'string',
                id: 'number',
                userId: 'number',
                dueDate: 'string',
                joins: 'string',
                nickNames: 'serializable',
                startTradeAt: 'string',
                fin: 'boolean',
            },
            debug: true,
        })

    const getTradeInfo = async (chatRoomId: string) => {
        return await getDataByKeys({ chatRoomId })
    }

    const updateTradeInfo = async (chatRoomId: string) => {
        return await updateDataByKey(
            {
                chatRoomId,
                fin: true,
            },
            { chatRoomId },
        )
    }

    useEffect(() => {}, [])
}

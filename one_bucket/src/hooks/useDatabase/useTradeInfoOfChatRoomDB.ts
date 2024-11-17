import { useEffect } from 'react'
import useDatabase, { ColumnTypes } from './useDatabase'
import { TradeInfoOfChatRoom } from '@/types/TradeInfoOfChatRoom'

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
            debug: false,
        })

    const addTradeInfo = async (data: TradeInfoOfChatRoom) => {
        return await addData(data)
    }

    const getTradeInfo = async (chatRoomId: string) => {
        return await getDataByKeys({ chatRoomId })
    }

    const updateTradeInfo = async (
        chatRoomId: string,
        data: Partial<TradeInfoOfChatRoom>,
    ) => {
        return await updateDataByKey({ chatRoomId: chatRoomId }, data)
    }

    return { getTradeInfo, updateTradeInfo, addTradeInfo }
}

export default useTradeInfoOfChatRoomDB

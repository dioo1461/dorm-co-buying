import { useEffect } from 'react'
import useDatabase, { ColumnTypes } from './useDatabase'
import { TradeInfoOfChatRoom } from '@/types/TradeInfoOfChatRoom'
import { getTradeInfoOfChatRoom } from '@/apis/chatService'

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
        const tradeInfo = await getDataByKeys({ chatRoomId })
        if (tradeInfo.length === 1) {
            return tradeInfo[0]
        }

        const fetchedTradeInfo: TradeInfoOfChatRoom = {
            ...(await getTradeInfoOfChatRoom(chatRoomId)),
            chatRoomId: chatRoomId,
        }

        await addTradeInfo(fetchedTradeInfo)
        return fetchedTradeInfo
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

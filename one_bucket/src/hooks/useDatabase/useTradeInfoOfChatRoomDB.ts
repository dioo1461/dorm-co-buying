import { useEffect } from 'react'
import useDatabase from './useDatabase'
import { TradeInfoOfChatRoom } from '@/types/TradeInfoOfChatRoom'
import { getTradeInfoOfChatRoom } from '@/apis/chatService'

const useTradeInfoOfChatRoomDB = () => {
    const { getDataByKeys, addData, updateDataByKey, deleteDataByKeys } =
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
        // deleteTradeInfo(chatRoomId)
        console.log('localdb: ', tradeInfo)
        if (tradeInfo.length === 1) {
            console.log('trade info found in local db')
            return tradeInfo[0]
        }

        console.log('fetching trade info from server')
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

    const deleteTradeInfo = async (chatRoomId: string) => {
        return await deleteDataByKeys({ chatRoomId })
    }

    return { getTradeInfo, updateTradeInfo, addTradeInfo, deleteTradeInfo }
}

export default useTradeInfoOfChatRoomDB

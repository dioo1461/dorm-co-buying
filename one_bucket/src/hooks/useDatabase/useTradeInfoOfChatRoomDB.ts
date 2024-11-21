import useDatabase from './useDatabase'
import { TradeInfoOfChatRoom } from '@/types/TradeInfoOfChatRoom'
import { getTradeInfoOfChatRoom } from '@/apis/chatService'

const useTradeInfoOfChatRoomDB = () => {
    const {
        getDataByKeys,
        addData,
        updateDataByKey,
        deleteDataByKeys,
        dropTable,
    } = useDatabase<TradeInfoOfChatRoom>({
        tableName: 'tradeInfoOfChatRoom',
        columns: {
            id: 'number',
            item: 'string',
            price: 'number',
            location: 'string',
            userId: 'number',
            wanted: 'number',
            count: 'number',
            linkUrl: 'string',
            tag: 'string',
            dueDate: 'string',
            joins: 'number',
            joinMember: 'serializable',
            createAt: 'string',
            updateAt: 'string',
            chatRoomId: 'string',
            fin: 'boolean',
        },
        debug: true,
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
            ...(await getTradeInfoOfChatRoom(chatRoomId)).trade,
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

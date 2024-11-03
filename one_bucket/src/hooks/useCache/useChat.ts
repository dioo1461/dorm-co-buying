import { useEffect, useState } from 'react'
import { SQLiteDatabase, openDatabase } from 'react-native-sqlite-storage'

interface inputProps {
    chatRoomId: string
}

interface outputProps {
    messages: any
    sendMessage: (message: string) => void
}

const useChat = (chatRoomId: string) => {
    const [db, setDb] = useState<SQLiteDatabase | null>(null)

    useEffect(() => {
        setDb(
            openDatabase(
                {
                    name: 'chat.db',
                    location: 'default',
                    createFromLocation: 1,
                },
                DB => {
                    console.log('Database opened')
                    // createTable()
                },
                error => {
                    console.log('Error:', error)
                },
            ),
        )
    }, [])
}

export default useChat

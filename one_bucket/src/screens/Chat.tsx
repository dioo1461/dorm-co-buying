import { darkColors, lightColors } from '@/constants/colors'
import { AppContext } from '@/hooks/useContext/AppContext'
import { useContext, useEffect } from 'react'
import { Appearance, Text, View } from 'react-native'

const Chat: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor } = useContext(AppContext)
    // 다크모드 변경 감지
    useEffect(() => {
        const themeSubscription = Appearance.addChangeListener(
            ({ colorScheme }) => {
                setThemeColor(colorScheme === 'dark' ? darkColors : lightColors)
            },
        )
        return () => themeSubscription.remove()
    }, [])

    return (
        <View>
            <Text>chat</Text>
        </View>
    )
}

export default Chat

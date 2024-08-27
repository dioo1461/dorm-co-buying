import { darkColors, Icolor, lightColors } from '@/constants/colors'
import { AppContext } from '@/hooks/useContext/AppContext'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useContext, useEffect } from 'react'
import { Appearance, StyleSheet, View } from 'react-native'
import { RootStackParamList } from '../navigation/NativeStackNavigation'

const BoardPost: React.FC = (): JSX.Element => {
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

    const styles = createStyles(themeColor)
    type BoardPostRouteProp = RouteProp<RootStackParamList, 'BoardPost'>
    const { params } = useRoute<BoardPostRouteProp>()

    return <View style={styles.container}></View>
}

const createStyles = (themeColor: Icolor) =>
    StyleSheet.create({
        container: { flex: 1 },
    })

export default BoardPost

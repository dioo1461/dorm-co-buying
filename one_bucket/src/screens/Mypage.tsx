import { Button, Text, View } from 'react-native'
import { AppContext } from '@/contexts/AppContext'
import { useContext } from 'react'

const Mypage = (): React.JSX.Element => {
    const { onLogout } = useContext(AppContext)
    return (
        <View>
            <Text>mypage</Text>
            <Button title='Complete' onPress={() => onLogout} />
        </View>
    )
}

export default Mypage

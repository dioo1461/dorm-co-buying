import { Button, Text, View } from 'react-native'
import { AppContext } from '@/hooks/contexts/AppContext'
import { useContext } from 'react'

const PostGroupPurchase = (): React.JSX.Element => {
    const { onLogOut } = useContext(AppContext)
    return (
        <View>
            <Text>PostGroupPurchase</Text>
        </View>
    )
}

export default PostGroupPurchase

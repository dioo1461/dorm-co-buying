import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'

export type RootStackParamList = {
    SignUp2: {
        phoneNumber: string
    }
    SignUp4: {
        schoolEmail: string
    }
    SignUp6: {
        email: string
        password: string
    }
}

type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>

export const stackNavigation = useNavigation<RootStackNavigationProp>

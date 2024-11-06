import { baseColors, Icolor } from '@/constants/colors'
import { View } from 'react-native'

interface LineProps {
    theme: Icolor
}

const Line: React.FC<LineProps> = ({ theme }) => {
    return (
        <View
            style={{
                borderBottomWidth: 1,
                borderBottomColor:
                    theme === theme ? baseColors.GRAY_3 : baseColors.GRAY_1,
                marginHorizontal: 10,
                marginVertical: 4,
            }}
        />
    )
}

export default Line

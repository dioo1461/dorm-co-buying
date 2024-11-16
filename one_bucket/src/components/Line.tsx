import { baseColors, Icolor } from '@/constants/colors'
import { View, ViewStyle } from 'react-native'

interface LineProps {
    theme: Icolor
    style?: ViewStyle
}

const Line: React.FC<LineProps> = ({ theme, style }) => {
    return (
        <View
            style={[
                {
                    borderBottomWidth: 1,
                    borderBottomColor:
                        theme === theme ? baseColors.GRAY_3 : baseColors.GRAY_1,
                },
                style,
            ]}
        />
    )
}

export default Line

import { baseColors, Icolor, lightColors } from '@/constants/colors'
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
                        theme === lightColors
                            ? baseColors.GRAY_3
                            : baseColors.GRAY_2,
                },
                style,
            ]}
        />
    )
}

export default Line

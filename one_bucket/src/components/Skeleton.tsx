import { baseColors, Icolor, lightColors } from '@/constants/colors'
import { ImageStyle, StyleProp, ViewStyle } from 'react-native'
import SkeletonContent from 'react-native-skeleton-content-nonexpo'

interface SkeletonPlaceholderProps {
    isLoading: boolean
    containerStyle?: StyleProp<ViewStyle>
    theme: Icolor
    children?: React.ReactNode
    layout?: Array<any>
}

const Skeleton: React.FC<SkeletonPlaceholderProps> = ({
    isLoading,
    theme,
    containerStyle,
    children,
    layout,
}): React.JSX.Element => {
    return theme === lightColors ? (
        <SkeletonContent
            isLoading={isLoading}
            containerStyle={containerStyle}
            highlightColor={baseColors.GRAY_4}
            boneColor={baseColors.GRAY_3}
            children={children}
            layout={layout}
        />
    ) : (
        <SkeletonContent
            isLoading={isLoading}
            containerStyle={containerStyle}
            highlightColor={baseColors.GRAY_3}
            boneColor={baseColors.GRAY_2}
            children={children}
            layout={layout}
        />
    )
}

export default Skeleton

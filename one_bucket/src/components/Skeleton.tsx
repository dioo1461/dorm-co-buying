import { baseColors, Icolor, lightColors } from '@/constants/colors'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

interface SkeletonPlaceholderProps {
    enabled: boolean
    theme: Icolor
    children: JSX.Element
}

const Skeleton: React.FC<SkeletonPlaceholderProps> = ({
    enabled,
    theme,
    children,
}): React.JSX.Element => {
    return theme === lightColors ? (
        <SkeletonPlaceholder
            enabled={enabled}
            backgroundColor={baseColors.GRAY_2}
            highlightColor={baseColors.GRAY_3}
            children={children}
        />
    ) : (
        <SkeletonPlaceholder
            enabled={enabled}
            backgroundColor={baseColors.GRAY_2}
            highlightColor={baseColors.GRAY_3}
            children={children}
        />
    )
}

export default Skeleton

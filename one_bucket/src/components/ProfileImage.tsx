import BasicProfileImage from '@/assets/drawable/basic-profile-image.svg'
import { CachedImage } from './CachedImage'
import { ImageStyle, View, ViewStyle } from 'react-native'
import Skeleton from './Skeleton'
import { Icolor } from '@/constants/colors'

const ProfileImage: React.FC<{
    imageUrl: string | null | undefined
    width: number
    height: number
    theme: Icolor
    containerStyle?: ViewStyle
}> = ({
    imageUrl,
    width,
    height,
    theme,
    containerStyle,
}): React.JSX.Element => {
    return (
        <Skeleton
            containerStyle={[{}, containerStyle]}
            theme={theme}
            isLoading={imageUrl === undefined}>
            {imageUrl ? (
                <CachedImage
                    imageUrl={imageUrl}
                    imageStyle={{ width: width, height: height } as ImageStyle}
                />
            ) : (
                <BasicProfileImage width={width} height={height} />
            )}
        </Skeleton>
    )
}

export default ProfileImage

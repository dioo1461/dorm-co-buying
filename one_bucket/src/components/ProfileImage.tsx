import BasicProfileImage from '@/assets/drawable/basic-profile-image.svg'
import { CachedImage } from './CachedImage'
import { ImageStyle, View, ViewStyle } from 'react-native'
import Skeleton from './Skeleton'
import { Icolor } from '@/constants/colors'

const ProfileImage: React.FC<{
    imageUrl: string | null | undefined
    size: number
    theme: Icolor
    containerStyle?: ViewStyle
}> = ({ imageUrl, size, theme, containerStyle }): React.JSX.Element => {
    return (
        <Skeleton
            containerStyle={[{}, containerStyle]}
            theme={theme}
            isLoading={imageUrl === undefined}>
            {imageUrl ? (
                <CachedImage
                    imageUrl={imageUrl + '.png'}
                    imageStyle={
                        {
                            width: size,
                            height: size,
                            borderWidth: 0.3,
                            borderColor: theme.BORDER,
                            borderRadius: size / 2,
                        } as ImageStyle
                    }
                />
            ) : (
                <BasicProfileImage width={size} height={size} />
            )}
        </Skeleton>
    )
}

export default ProfileImage

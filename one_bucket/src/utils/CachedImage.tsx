import { useEffect, useState } from 'react'
import { Image, ImageStyle, Platform, StyleProp } from 'react-native'
import * as RNFS from 'react-native-fs'

interface Props {
    imageStyle: StyleProp<ImageStyle>
    imageSource: { id: string; storageUri: string }
}

export const CachedImage = ({
    imageStyle,
    imageSource,
}: Props): React.JSX.Element => {
    const [source, setSource] = useState<undefined | { uri: string }>(undefined)
    const extension = Platform.OS === 'android' ? 'file://' : ''

    const path = `${extension}${RNFS.CachesDirectoryPath}/${imageSource.id}.jpg`

    const loadFile = (path: string) => {
        setSource({ uri: path })
    }

    const downloadFile = async (uri: string, path: string) => {
        RNFS.downloadFile({
            fromUrl: uri,
            toFile: path,
        }).promise.then(() => {
            loadFile(path)
        })
    }

    useEffect(() => {
        RNFS.exists(path).then(exists => {
            if (exists) {
                loadFile(path)
                console.log('loadfile')
            } else {
                downloadFile(imageSource.storageUri, path)
                console.log('downloadfile')
            }
        })
    }, [])

    return <Image style={imageStyle} source={source} />
}

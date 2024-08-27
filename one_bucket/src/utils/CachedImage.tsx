import { useEffect, useState } from 'react'
import { Image, ImageStyle, Platform, StyleProp } from 'react-native'
import * as RNFS from 'react-native-fs'

interface Props {
    imageStyle: StyleProp<ImageStyle>
    imageSource: { id: string; storageUri: string }
}

interface tempProps {
    imageStyle: StyleProp<ImageStyle>
    image: ArrayBuffer
    imageId: string
}

export const CachedImage = ({
    imageStyle,
    image,
    imageId,
}: tempProps): React.JSX.Element => {
    const [source, setSource] = useState<undefined | { uri: string }>(undefined)
    const extension = Platform.OS === 'android' ? 'file://' : ''

    const path = `${extension}${RNFS.CachesDirectoryPath}/${imageId}.jpg`

    const loadFile = (path: string) => {
        setSource({ uri: path })
    }

    // const blobToBase64 = (arrayBuffer: ArrayBuffer): Promise<string> => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader()
    //         reader.onloadend = () => {
    //             resolve(reader.result as string)
    //         }
    //         reader.onerror = reject
    //         reader.readAsDataURL(arrayBuffer)
    //     })
    // }

    const downloadFile = async (uri: string, path: string) => {
        RNFS.downloadFile({
            fromUrl: uri,
            toFile: path,
        }).promise.then(() => {
            loadFile(path)
        })
    }

    const fetchFile = async () => {
        const encoded = Buffer.from(image).toString('base64')
        RNFS.writeFile(path, encoded, 'base64')
            .then(() => {
                loadFile(path)
            })
            .catch(err => {
                console.log('error while fetching file:\n', err)
            })
    }

    useEffect(() => {
        RNFS.exists(path).then(exists => {
            if (exists) {
                loadFile(path)
                console.log('loadfile')
            } else {
                // downloadFile(imageSource.storageUri, path)
                fetchFile()
                console.log('downloadfile')
            }
        })
    }, [])

    return <Image style={imageStyle} source={source} />
}

import { useEffect, useState } from 'react'
import {
    Image,
    ImageStyle,
    Platform,
    StyleProp,
    Text,
    View,
} from 'react-native'
import * as RNFS from 'react-native-fs'

interface Props {
    imageStyle: StyleProp<ImageStyle>
    imageSource: { id: string; imageUri: string }
}

export const CachedImage = ({
    imageStyle,
    imageSource,
}: Props): React.JSX.Element => {
    const [source, setSource] = useState<undefined | { uri: string }>(undefined)
    const extension = Platform.OS === 'android' ? 'file://' : ''

    const path = `${extension}${RNFS.DocumentDirectoryPath}${imageSource.id}`

    const loadFile = (path: string) => {
        setSource({ uri: path })
    }

    const downloadFile = async (uri: string, path: string) => {
        const directoryPath = path.substring(0, path.lastIndexOf('/')) // 디렉터리 경로 추출

        // 디렉터리 존재 여부 확인 후 없으면 생성
        RNFS.exists(directoryPath)
            .then(exists => {
                if (!exists) {
                    return RNFS.mkdir(directoryPath) // 디렉터리 생성
                }
                return Promise.resolve()
            })
            .then(() => {
                // 파일 다운로드
                return RNFS.downloadFile({
                    fromUrl: uri,
                    toFile: path,
                }).promise
            })
            .then(() => {
                loadFile(path) // 파일 로드
            })
            .catch(error => {
                console.log('downloadFile error -', error)
            })
    }

    useEffect(() => {
        RNFS.exists(path).then(exists => {
            if (exists) {
                loadFile(path)
                console.log('loadfile - path:', path)
            } else {
                downloadFile(imageSource.imageUri, path)
                console.log(
                    'downloadfile - uri:',
                    imageSource.imageUri,
                    'path:',
                    path,
                )
            }
        })
    }, [])

    if (!source) return <></>

    return (
        <View>
            <Image style={imageStyle} source={source} />
        </View>
    )
}

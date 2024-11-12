import { STORAGE_BASE_URL } from '@env'
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
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'

interface Props {
    imageStyle: StyleProp<ImageStyle>
    imageUrl: string
    isExternalUrl?: boolean
    getSavedPath?: (originUrl: string, path: string) => void
    onLoad?: (res: Promise<void>) => void
}

export const CachedImage = ({
    imageStyle,
    imageUrl,
    isExternalUrl = false,
    getSavedPath,
    onLoad,
}: Props): React.JSX.Element => {
    const [source, setSource] = useState<undefined | { uri: string }>(undefined)
    const extension = Platform.OS === 'android' ? 'file://' : ''

    const path = `${extension}${RNFS.DocumentDirectoryPath}${imageUrl.substring(
        imageUrl.lastIndexOf('/') + 1,
    )}`

    const loadFile = (path: string) => {
        setSource({ uri: path })
    }

    const downloadFile = async (uri: string, path: string) => {
        const directoryPath = path.substring(0, path.lastIndexOf('/')) // 디렉터리 경로 추출

        // 디렉터리 존재 여부 확인 후 없으면 생성
        return RNFS.exists(directoryPath)
            .then(exists => {
                if (!exists) {
                    return RNFS.mkdir(directoryPath) // 디렉터리 생성
                }
                return Promise.resolve()
            })
            .then(() => {
                // 파일 다운로드
                const downloadUrl = isExternalUrl
                    ? imageUrl
                    : STORAGE_BASE_URL + '/' + imageUrl
                return RNFS.downloadFile({
                    fromUrl: downloadUrl,
                    toFile: path,
                }).promise
            })
            .then(res => {
                getSavedPath && getSavedPath(imageUrl, path)
                loadFile(path) // 파일 로드
            })
            .catch(error => {
                console.log('downloadFile error -', error)
            })
    }

    useEffect(() => {
        const promise = RNFS.exists(path).then(exists => {
            getSavedPath && getSavedPath(imageUrl, path)
            if (exists) {
                loadFile(path)
            } else {
                return downloadFile(imageUrl, path)
            }
        })

        if (onLoad) {
            onLoad(promise)
        }
    }, [])

    if (!source) return <></>

    return (
        <View>
            <Image style={imageStyle} source={source} />
        </View>
    )
}

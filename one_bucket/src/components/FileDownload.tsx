import RNFetchBlob from 'react-native-blob-util'
import { STORAGE_BASE_URL } from '@env'

const createDirectoryIfNotExists = async (path: string) => {
    const exists = await RNFetchBlob.fs.isDir(path)
    if (!exists) {
        await RNFetchBlob.fs.mkdir(path)
        console.log('Directory created:', path)
    }
}

export const FileDownload = async (fileName: string, fileUrl: string) => {
    try {
        const directoryPath = '/storage/emulated/0/Download'
        const customPath = `${directoryPath}/${fileName}`
        // 디렉토리 생성 확인
        await createDirectoryIfNotExists(directoryPath)
        const res = await RNFetchBlob.config({
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: customPath,
                mime: 'application/octet-stream',
                mediaScannable: true,
            },
        }).fetch('GET', STORAGE_BASE_URL + fileUrl)
        console.log('File downloaded to:', res.path())
    } catch (error) {
        console.error('Download failed:', error)
    }
}

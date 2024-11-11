import { createBoardPost, saveImage } from '@/apis/boardService'
import CloseButton from '@/assets/drawable/close-button.svg'
import IcPhotoAdd from '@/assets/drawable/ic-photo-add.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { CreateBoardPostRequestBody } from '@/data/request/board/CreateBoardPostRequestBody'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import {
    Appearance,
    Image,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    TextInputContentSizeChangeEventData,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import {
    ImageLibraryOptions,
    launchImageLibrary,
} from 'react-native-image-picker'
import {
    RootStackParamList,
    stackNavigation,
} from '../../navigation/NativeStackNavigation'
import strings from '@/constants/strings'
import { CachedImage } from '@/components/CachedImage'

// TODO : 이미지 보내기 전 크기 축소하기

const UpdateBoardPost: React.FC = (): JSX.Element => {
    const { boardList, themeColor, setThemeColor } = useBoundStore(state => ({
        boardList: state.boardList,
        themeColor: state.themeColor,
        setThemeColor: state.setThemeColor,
    }))

    // 다크모드 변경 감지
    useEffect(() => {
        const themeSubscription = Appearance.addChangeListener(
            ({ colorScheme }) => {
                setThemeColor(colorScheme === 'dark' ? darkColors : lightColors)
            },
        )
        return () => themeSubscription.remove()
    }, [])

    // navigation 헤더 옵션 설정
    useEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: themeColor.BG },
            headerTintColor: themeColor.TEXT,
            headerTitle: () => (
                <Text
                    style={{
                        color: themeColor.TEXT,
                        fontSize: 16,
                        fontFamily: 'NanumGothic-Bold',
                    }}>
                    {strings.updateBoardPostScreenTitle}
                </Text>
            ),
        })
    }, [themeColor])

    const styles = createStyles(themeColor)
    type UpdateBoardPostRouteProp = RouteProp<
        RootStackParamList,
        'UpdateBoardPost'
    >
    const { params } = useRoute<UpdateBoardPostRouteProp>()

    const navigation = stackNavigation()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [inputHeight, setInputHeight] = useState(200)
    const [preventMultPost, setPreventMultPost] = useState(true)

    interface UpdateImageProps {
        uri: string
        from: 'server' | 'local'
    }

    const [imageUriList, setImageUriList] = useState<UpdateImageProps[]>(
        params.imageUrlList.map((url: string) => ({
            uri: url,
            from: 'server',
        })),
    )

    useEffect(() => {
        setTitle(params.title)
        setContent(params.content)
    }, [])

    const addImage = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: 10 - imageUriList.length,
        }

        launchImageLibrary(options, response => {
            const newImageUriList: UpdateImageProps[] = []
            response.assets?.forEach(asset => {
                if (asset.uri) {
                    newImageUriList.push({ uri: asset.uri, from: 'local' })
                }
            })
            setImageUriList([...imageUriList, ...newImageUriList])
        })
    }

    const deleteImage = (index: number) => {
        const newImageUriList = [...imageUriList]
        newImageUriList.splice(index, 1)
        setImageUriList(newImageUriList)
    }

    const handleInputTextHeightChange = (
        event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
    ) => {
        const { height } = event.nativeEvent.contentSize
        if (height > 200) setInputHeight(height)
    }

    const onSubmit = async () => {
        let submitForm: CreateBoardPostRequestBody = {
            boardId: params.boardId,
            title: title,
            text: content,
        }

        createBoardPost(submitForm)
            .then(res => {
                console.log('board post created')
                // setPendingBoardRefresh(true)
                // useBoundStore.setState({ pendingBoardRefresh: true })
                // params.setPendingRefresh(true)
                if (imageUriList.length > 0) {
                    const formData = new FormData()
                    imageUriList.forEach((value, index) => {
                        // 파일 정보 추출
                        const filename = value.split('/').pop() // 파일 이름 추출
                        const fileExtension = filename!.split('.').pop() // 파일 확장자 추출
                        // FormData에 파일 추가
                        formData.append('file', {
                            uri: value,
                            name: filename, // 파일 이름
                            type: `image/${fileExtension}`, // MIME 타입 설정
                        })
                    })
                    saveImage(res.id, formData)
                }
                setTimeout(() => {
                    navigation.navigate('Board', {
                        pendingRefresh: true,
                    })
                }, 100)
            })
            .catch(err => {
                console.log('board post create failed')
                console.log(err)
            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.bodyContainer}>
                <TextInput
                    style={styles.titleTextInput}
                    placeholder='제목을 입력해주세요.'
                    placeholderTextColor={baseColors.GRAY_2}
                    value={title}
                    onChangeText={text => setTitle(text)}
                />
                <TextInput
                    style={[
                        styles.contentTextInput,
                        { minHeight: inputHeight },
                    ]}
                    placeholder='내용을 입력해주세요.'
                    placeholderTextColor={baseColors.GRAY_2}
                    value={content}
                    onChangeText={text => setContent(text)}
                    multiline={true}
                    textAlignVertical='top'
                    onContentSizeChange={handleInputTextHeightChange}
                />
                {/* ### 제품 이미지 ### */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={styles.imageScrollViewContainer}>
                    {imageUriList.map((updateImageProp, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <TouchableOpacity>
                                {updateImageProp.from === 'server' ? (
                                    <CachedImage
                                        imageUrl={updateImageProp.uri}
                                        imageStyle={styles.image}
                                    />
                                ) : (
                                    <Image
                                        source={{ uri: updateImageProp.uri }}
                                        style={styles.image}
                                    />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => deleteImage(index)}>
                                <CloseButton />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.imageUploader}
                        onPress={addImage}>
                        <View style={styles.imagePlaceholder}>
                            <IcPhotoAdd />
                            <Text
                                style={
                                    styles.imageCountText
                                }>{`${imageUriList.length}/10`}</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <View style={styles.postButtonContainer}>
                <TouchableNativeFeedback
                    disabled={!!(!title || !content || !preventMultPost)}
                    onPress={() => {
                        onSubmit()
                        setPreventMultPost(false)
                    }}>
                    <View
                        style={{
                            ...styles.postButton,
                            backgroundColor:
                                !title || !content
                                    ? baseColors.GRAY_2
                                    : baseColors.SCHOOL_BG,
                        }}>
                        <Text style={styles.postButtonText}>게시</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: { flex: 1 },
        bodyContainer: {
            marginHorizontal: 20,
        },
        titleTextInput: {
            color: theme.TEXT,
            borderBottomColor: baseColors.GRAY_1,
            fontFamily: 'NanumGothic-Bold',
            fontSize: 16,
            width: '100%',
            borderBottomWidth: 1,
            marginTop: 16,
            marginVertical: 0,
            marginBottom: 10,
            backgroundColor: 'transparent',
        },
        contentTextInput: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 14,
            width: '100%',
            marginBottom: 10,
            backgroundColor: 'transparent',
        },
        postButtonContainer: {
            position: 'absolute',
            marginTop: 16,
            bottom: 0,
            left: 0,
            right: 0,
        },
        postButton: {
            backgroundColor: baseColors.SCHOOL_BG,
            padding: 20,
            alignItems: 'center',
        },
        postButtonText: {
            color: theme.BUTTON_TEXT,
            fontFamily: 'NanumGothic-Bold',
            fontSize: 14,
        },
        imageScrollViewContainer: {
            height: 82,
            marginBottom: 16,
        },
        imageContainer: {
            borderColor: baseColors.GRAY_2,
            position: 'relative',
            width: 72,
            height: 72,
            borderWidth: 1,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            marginEnd: 14,
            marginTop: 10,
        },
        image: {
            width: 72,
            height: 72,
            borderRadius: 8,
        },
        imageCountText: {
            color: theme.TEXT_TERTIARY,
        },
        closeButton: {
            position: 'absolute',
            top: -10,
            right: -10,
        },
        imageUploader: {
            borderColor: baseColors.GRAY_2,
            width: 72,
            height: 72,
            borderWidth: 1,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
        },
        imagePlaceholder: {
            justifyContent: 'center',
            alignItems: 'center',
        },
    })

export default UpdateBoardPost

import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Button,
    ScrollView,
    Keyboard,
    KeyboardEvent,
} from 'react-native'
import {
    launchImageLibrary,
    ImageLibraryOptions,
} from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'

const PostGroupPurchase: React.FC = () => {
    const [imageUri, setImageUri] = useState<string | null>(null)
    const [siteLink, setSiteLink] = useState('')
    const [item, setItem] = useState('')
    const [price, setPrice] = useState('')
    const [totalAmount, setTotalAmount] = useState('')
    const [peopleCount, setPeopleCount] = useState<number | null>(null)
    const [description, setDescription] = useState('')
    const [keyboardHeight, setKeyboardHeight] = useState(0)

    const navigation = useNavigation()

    const selectImage = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: 1,
        }

        launchImageLibrary(options, response => {
            if (
                response.assets &&
                response.assets.length > 0 &&
                response.assets[0].uri
            ) {
                setImageUri(response.assets[0].uri)
            }
        })
    }

    useEffect(() => {
        const onKeyboardShow = (event: KeyboardEvent) => {
            setKeyboardHeight(event.endCoordinates.height)
        }
        const onKeyboardHide = () => {
            setKeyboardHeight(0)
        }

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            onKeyboardShow,
        )
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            onKeyboardHide,
        )

        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        }
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon
                    name='arrow-back'
                    size={24}
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.headerTitle}>공동구매 글 작성</Text>
                <Text style={styles.tempSave}>임시저장</Text>
            </View>

            <ScrollView style={{ flex: 1 }}>
                <TouchableOpacity
                    style={styles.imageUploader}
                    onPress={selectImage}>
                    {imageUri ? (
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.image}
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Icon name='camera-alt' size={48} color='gray' />
                            <Text>0/10</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder='사이트 링크'
                    value={siteLink}
                    onChangeText={setSiteLink}
                />

                <Text style={styles.label}>품목 *</Text>
                <TextInput
                    style={styles.input}
                    placeholder='품목'
                    value={item}
                    onChangeText={setItem}
                />

                <Text style={styles.label}>가격 *</Text>
                <TextInput
                    style={styles.input}
                    placeholder='가격'
                    value={price}
                    onChangeText={setPrice}
                    keyboardType='numeric'
                />

                <Text style={styles.label}>총 수량 *</Text>
                <TextInput
                    style={styles.input}
                    placeholder='총 수량'
                    value={totalAmount}
                    onChangeText={setTotalAmount}
                    keyboardType='numeric'
                />

                <Text style={styles.label}>모집 인원 (본인 포함) *</Text>
                <View style={styles.peopleCountContainer}>
                    {[2, 3, 4, 5].map(count => (
                        <TouchableOpacity
                            key={count}
                            style={[
                                styles.peopleCountButton,
                                peopleCount === count && styles.selectedButton,
                            ]}
                            onPress={() => setPeopleCount(count)}>
                            <Icon
                                name='person'
                                size={24}
                                color={peopleCount === count ? 'white' : 'gray'}
                            />
                            <Text
                                style={{
                                    color:
                                        peopleCount === count
                                            ? 'white'
                                            : 'gray',
                                }}>
                                {count}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={styles.peopleCountButton}
                        onPress={() => setPeopleCount(null)}>
                        <Text style={{ color: 'gray' }}>직접 입력</Text>
                    </TouchableOpacity>
                </View>

                <Button title='장소 선택' onPress={() => {}} />

                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder='추가 설명을 작성해 주세요.'
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
            </ScrollView>

            <View
                style={[
                    styles.postButtonContainer,
                    { bottom: keyboardHeight },
                ]}>
                <TouchableOpacity style={styles.postButton}>
                    <Text style={styles.postButtonText}>게시</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    tempSave: {
        color: '#003366',
    },
    imageUploader: {
        height: 200,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 16,
    },
    imagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 8,
        margin: 16,
    },
    label: {
        marginLeft: 16,
        marginTop: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    peopleCountContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        marginLeft: 16,
    },
    peopleCountButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        marginRight: 8,
    },
    selectedButton: {
        backgroundColor: '#003366',
        borderColor: '#003366',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    postButtonContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderTopWidth: 1,
        borderColor: 'gray',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    postButton: {
        backgroundColor: '#003366',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    postButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
})

export default PostGroupPurchase

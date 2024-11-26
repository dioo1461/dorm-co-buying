import { saveGroupTradePostImage } from '@/apis/groupTradeService'
import CloseButton from '@/assets/drawable/close-button.svg'
import IcPhotoAdd from '@/assets/drawable/ic-photo-add.svg'
import { CreateGroupTradePostBottomSheet } from '@/components/bottomSheet/CreateGroupTradePostBottomSheet'
import LoadingBackdrop from '@/components/LoadingBackdrop'
import { baseColors, Icolor, lightColors } from '@/constants/colors'
import { CreateGroupTradePostRequestBody } from '@/data/request/groupTrade/CreateGroupTradePostRequestBody'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import CheckBox from '@react-native-community/checkbox'
import React, { useRef, useState } from 'react'
import {
    Image,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import {
    ImageLibraryOptions,
    launchImageLibrary,
} from 'react-native-image-picker'
import { SelectList } from 'react-native-dropdown-select-list'

const CreateGroupTradePost: React.FC = (): React.JSX.Element => {
    const { themeColor, boardList } = useBoundStore(state => ({
        themeColor: state.themeColor,
        boardList: state.boardList,
    }))

    const styles = createStyles(themeColor)
    const navigation = stackNavigation()

    const [loadingBackdropEnabled, setLoadingBackdropEnabled] = useState(false)

    const [imageUriList, setImageUriList] = useState<string[]>([])
    const [siteLink, setSiteLink] = useState('')
    const [itemName, setItemName] = useState('')
    const [tag, setTag] = useState('')
    const [price, setPrice] = useState('')
    const [totalAmount, setTotalAmount] = useState('')
    const [peopleCount, setPeopleCount] = useState<number | null>(null)
    const [deadline, setDeadline] = useState<number | null>(null)
    const [location, setLocation] = useState('')
    const [descriptionTextInput, setDescriptionTextInput] = useState('')
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const [isLocationNegotiable, setIsLocationNegotiable] = useState(true)

    const tagList = ['가공식품','신선식품', '음료/물', '의약품', '일회용품', '전자기기', '쿠폰', '기타']

    const [peopleCountManualInputEnabled, setPeopleCountManualInputEnabled] =
        useState(false)
    const peopleCountManualInputRef = useRef<TextInput>(null)
    const [deadlineManualInputEnabled, setDeadlineManualInputEnabled] =
        useState(false)

    const [bottomSheetEnabled, setBottomSheetEnabled] = useState(false)

    const deadlineManualInputRef = useRef<TextInput>(null)
    const scrollViewRef = useRef<ScrollView>(null)

    const addImage = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: 10 - imageUriList.length,
        }

        launchImageLibrary(options, response => {
            const newImageUriList: string[] = []
            response.assets?.forEach(asset => {
                if (asset.uri) {
                    newImageUriList.push(asset.uri)
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

    const onPeopleCountManualInputPress = () => {
        setPeopleCount(null)
        setPeopleCountManualInputEnabled(true)
        requestAnimationFrame(() => {
            peopleCountManualInputRef.current?.focus()
        })
    }

    const onDeadlineManualInputPress = () => {
        setDeadline(null)
        setDeadlineManualInputEnabled(true)
        requestAnimationFrame(() => {
            deadlineManualInputRef.current?.focus()
        })
    }

    const findGroupTradeBoardId = () => {
        const groupTradeBoard = boardList.find(
            board => board.type === 'groupTradePost',
        )
        if (groupTradeBoard) {
            return groupTradeBoard.id
        }
        throw new Error('CreateGroupTradePost - GroupTrade board not found')
    }

    const onSubmitButtonPress = () => {
        setBottomSheetEnabled(true)
    }

    const checkFormAvailable = () => {
        return (
            imageUriList.length > 0 &&
            itemName.length > 0 &&
            tag != '' &&
            price.length > 0 &&
            totalAmount.length > 0 &&
            peopleCount !== null &&
            deadline !== null &&
            location !== ''
        )
    }

    const makeSubmitForm = () => {
        const submitForm: CreateGroupTradePostRequestBody = {
            post: {
                boardId: findGroupTradeBoardId(),
                title: itemName,
                text: descriptionTextInput,
            },
            trade: {
                item: itemName,
                wanted: Number(totalAmount),
                price: Number(price),
                count: peopleCount ?? 0,
                location: location,
                linkUrl: siteLink,
                tag: tag,
                dueDate: deadline ?? -1,
            },
            chatRoomName: '',
        }

        return submitForm
    }

    const onSubmitComplete = (postId: number) => {
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
        console.log(postId)
        saveGroupTradePostImage(postId, formData).then(() => {
            navigation.goBack()
            navigation.navigate('GroupTradePost', { postId: postId })
        })
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.mainScrollViewContainer}
                    showsVerticalScrollIndicator={false}>
                    {/* ### 제품 이미지 ### */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        style={styles.imageScrollViewContainer}>
                        {imageUriList.map((uri, index) => (
                            <View key={index} style={styles.imageContainer}>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate(
                                            'ImageEnlargement',
                                            {
                                                imageUriList: imageUriList,
                                                index: index,
                                                isLocalUri: true,
                                            },
                                        )
                                    }>
                                    <Image
                                        source={{ uri: uri }}
                                        style={styles.image}
                                    />
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

                    {/* ### 사이트 링크 ### */}
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>사이트 링크</Text>
                    </View>
                    <TextInput
                        style={styles.textInput}
                        placeholder='https://www.market.com/product-name'
                        placeholderTextColor={themeColor.TEXT_TERTIARY}
                        value={siteLink}
                        onChangeText={setSiteLink}
                        keyboardType='url'
                    />
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>품목명</Text>
                        <Text style={styles.accent}> *</Text>
                    </View>
                    <TextInput
                        style={styles.textInput}
                        placeholder='품목명'
                        placeholderTextColor={themeColor.TEXT_TERTIARY}
                        value={itemName}
                        onChangeText={setItemName}
                    />
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>카테고리</Text>
                        <Text style={styles.accent}> *</Text>
                    </View>
                    <SelectList
                        setSelected={setTag}
                        data={tagList}
                        save='value'
                        placeholder={'카테고리를 선택해 주세요.'}
                        inputStyles={styles.categoryText}
                        search={false}
                    />  
                    {/* ### 가격 ### */}
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>가격</Text>
                        <Text style={styles.accent}> *</Text>
                    </View>
                    <TextInput
                        style={styles.textInput}
                        placeholder='가격'
                        placeholderTextColor={themeColor.TEXT_TERTIARY}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType='numeric'
                    />

                    {/* ### 총 수량 ### */}
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>총 수량</Text>
                        <Text style={styles.accent}> *</Text>
                    </View>
                    <TextInput
                        style={styles.textInput}
                        placeholder='총 수량'
                        placeholderTextColor={themeColor.TEXT_TERTIARY}
                        value={totalAmount}
                        onChangeText={setTotalAmount}
                        keyboardType='numeric'
                    />

                    {/* ### 모집 인원 ### */}
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>모집 인원 (본인 포함)</Text>
                        <Text style={styles.accent}> *</Text>
                    </View>
                    <View style={styles.peopleCountContainer}>
                        {[2, 3, 4, 5].map(count => (
                            <View
                                key={count}
                                style={{
                                    flex: 2,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <TouchableOpacity
                                    style={[
                                        styles.selectionButton,
                                        peopleCount === count &&
                                            styles.selectedButton,
                                    ]}
                                    onPress={() => {
                                        setPeopleCount(count)
                                        setPeopleCountManualInputEnabled(false)
                                    }}>
                                    <Text
                                        style={{
                                            color:
                                                peopleCount === count
                                                    ? 'white'
                                                    : 'gray',
                                        }}>
                                        {`${count}명`}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity
                            style={[
                                styles.manualInputButton,
                                peopleCountManualInputEnabled
                                    ? styles.selectedButton
                                    : {},
                            ]}
                            onPress={onPeopleCountManualInputPress}>
                            <TextInput
                                ref={peopleCountManualInputRef}
                                style={[
                                    styles.manualInputText,
                                    peopleCountManualInputEnabled
                                        ? { color: baseColors.WHITE }
                                        : { color: baseColors.GRAY_2 },
                                ]}
                                onChangeText={text =>
                                    setPeopleCount(Number(text))
                                }
                                placeholder='직접 입력'
                                placeholderTextColor={
                                    peopleCountManualInputEnabled
                                        ? 'white'
                                        : 'gray'
                                }
                                maxLength={2}
                                editable={peopleCountManualInputEnabled}
                                keyboardType='numeric'
                            />
                            <Text
                                style={[
                                    styles.manualInputAffixText,
                                    { marginBottom: 2 },
                                ]}>
                                {peopleCountManualInputEnabled && peopleCount
                                    ? ' 명'
                                    : ''}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* ### 마감 기한 ### */}
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>마감 기한</Text>
                        <Text style={styles.accent}> *</Text>
                    </View>

                    <View style={styles.peopleCountContainer}>
                        {[3, 5, 7, 9].map(count => (
                            <View
                                key={count}
                                style={{
                                    flex: 2,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <TouchableOpacity
                                    style={[
                                        styles.selectionButton,
                                        deadline === count &&
                                            styles.selectedButton,
                                    ]}
                                    onPress={() => {
                                        setDeadline(count)
                                        setDeadlineManualInputEnabled(false)
                                    }}>
                                    <Text
                                        style={{
                                            color:
                                                deadline === count
                                                    ? 'white'
                                                    : 'gray',
                                        }}>
                                        {`D-${count}`}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity
                            style={[
                                styles.manualInputButton,
                                deadlineManualInputEnabled
                                    ? styles.selectedButton
                                    : {},
                            ]}
                            onPress={onDeadlineManualInputPress}>
                            <Text style={styles.manualInputAffixText}>
                                {deadlineManualInputEnabled && deadline
                                    ? 'D-'
                                    : ''}
                            </Text>

                            <TextInput
                                ref={deadlineManualInputRef}
                                style={[
                                    styles.manualInputText,
                                    deadlineManualInputEnabled
                                        ? { color: baseColors.WHITE }
                                        : { color: baseColors.GRAY_2 },
                                ]}
                                maxLength={2}
                                onChangeText={text => setDeadline(Number(text))}
                                placeholder='직접 입력'
                                placeholderTextColor={
                                    deadlineManualInputEnabled
                                        ? 'white'
                                        : 'gray'
                                }
                                editable={deadlineManualInputEnabled}
                                keyboardType='numeric'
                            />
                        </TouchableOpacity>
                    </View>

                    {/* ### 장소 선택 ### */}
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>거래 희망 장소</Text>
                        <Text style={styles.accent}> *</Text>
                    </View>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={setLocation}
                        value={location}
                        placeholder='구체적인 장소를 입력해주세요. ex) XX관 XXX호'
                        placeholderTextColor={themeColor.TEXT_SECONDARY}
                    />
                    {/*
                    <Text style={styles.locationText}>장소 선택</Text>
                    <IcAngleRight width={16} height={16} fill='gray' />
                    */}
                    <TouchableOpacity
                        style={styles.checkBoxContainer}
                        onPress={() =>
                            setIsLocationNegotiable(!isLocationNegotiable)
                        }>
                        <CheckBox
                            disabled={false}
                            value={isLocationNegotiable}
                            onValueChange={newVal =>
                                setIsLocationNegotiable(newVal)
                            }
                            tintColors={
                                themeColor === lightColors
                                    ? {
                                          true: baseColors.SCHOOL_BG,
                                          false: baseColors.GRAY_2,
                                      }
                                    : {
                                          true: baseColors.WHITE,
                                          false: baseColors.GRAY_1,
                                      }
                            }
                        />
                        <Text
                            style={[
                                styles.checkBoxLabelText,
                                {
                                    color: !isLocationNegotiable
                                        ? themeColor.TEXT_TERTIARY
                                        : themeColor === lightColors
                                        ? baseColors.SCHOOL_BG
                                        : baseColors.WHITE,
                                },
                            ]}>
                            거래 장소 협의 가능
                        </Text>
                    </TouchableOpacity>

                    {/* ### 추가 설명 ### */}
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>설명</Text>
                    </View>
                    <TextInput
                        style={[styles.textInput, styles.descriptionTextInput]}
                        placeholder='추가 설명을 작성해 주세요.'
                        placeholderTextColor={themeColor.TEXT_TERTIARY}
                        value={descriptionTextInput}
                        onChangeText={setDescriptionTextInput}
                        multiline
                    />
                    <View style={{ height: 80 }}></View>
                </ScrollView>
            </KeyboardAvoidingView>
            <View
                style={[
                    styles.postButtonContainer,
                    { bottom: keyboardHeight },
                ]}>
                <TouchableOpacity
                    style={[
                        styles.postButton,
                        {
                            backgroundColor: checkFormAvailable()
                                ? themeColor.BUTTON_BG
                                : themeColor.BUTTON_SECONDARY_BG_DARKER,
                        },
                    ]}
                    onPress={onSubmitButtonPress}
                    disabled={!checkFormAvailable()}>
                    <Text style={styles.postButtonText}>게시</Text>
                </TouchableOpacity>
            </View>
            <CreateGroupTradePostBottomSheet
                enabled={bottomSheetEnabled}
                theme={themeColor}
                submitForm={makeSubmitForm()}
                setLoadingEnabled={setLoadingBackdropEnabled}
                onClose={() => setBottomSheetEnabled(false)}
                onSubmitComplete={onSubmitComplete}
            />
            <LoadingBackdrop
                enabled={loadingBackdropEnabled}
                theme={themeColor}
            />
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.BG,
            flex: 1,
        },
        mainScrollViewContainer: {
            margin: 16,
            marginBottom: 54,
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
        labelContainer: {
            flexDirection: 'row',
            marginTop: 16,
            marginBottom: 6,
        },
        label: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic-Bold',
        },
        accent: {
            fontFamily: 'NanumGothic-Bold',
            color: theme.ACCENT_TEXT,
        },
        textInput: {
            color: theme.TEXT,
            borderColor: baseColors.GRAY_2,
            borderWidth: 1,
            borderRadius: 8,
            padding: 8,
        },
        categoryText: {
            color: theme.TEXT,
        },
        peopleCountContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginBottom: 16,
        },
        selectionButton: {
            borderColor: baseColors.GRAY_2,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: 1,
            borderRadius: 8,
        },
        manualInputButton: {
            borderColor: baseColors.GRAY_2,
            flex: 2,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 4,
            borderWidth: 1,
            borderRadius: 8,
        },
        manualInputText: {
            flex: 2,
            padding: 0,
            margin: 0,
            fontSize: 14,
        },
        manualInputAffixText: {
            color: 'white',
            fontFamily: 'NanumGothic',
            fontSize: 14,
        },
        selectedButton: {
            backgroundColor: baseColors.SCHOOL_BG,
            borderColor: baseColors.SCHOOL_BG,
        },
        descriptionTextInput: {
            height: 100,
            textAlignVertical: 'top',
        },
        locationSelectionButton: {
            borderColor: baseColors.GRAY_2,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
        },
        locationText: {},
        checkBoxContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
        },
        checkBoxLabelText: {
            marginBottom: 4,
        },
        postButtonContainer: {
            position: 'absolute',
            marginTop: 16,
            bottom: 0,
            left: 0,
            right: 0,
        },
        postButton: {
            padding: 20,
            alignItems: 'center',
        },
        postButtonText: {
            color: theme.BUTTON_TEXT,
            fontFamily: 'NanumGothic-Bold',
            fontSize: 14,
        },
    })

export default CreateGroupTradePost

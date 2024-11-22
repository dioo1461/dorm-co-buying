import { baseColors, Icolor } from '@/constants/colors'
import {
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import BottomSheet from './BottomSheet'

import { createGroupTradePost } from '@/apis/groupTradeService'
import { CreateGroupTradePostRequestBody } from '@/data/request/groupTrade/CreateGroupTradePostRequestBody'
import { useEffect, useState } from 'react'
import Accordion from '../Accordion'

interface Props {
    enabled: boolean
    theme: Icolor
    submitForm: CreateGroupTradePostRequestBody
    setLoadingEnabled: (enabled: boolean) => void
    onClose: () => void
    onSubmitComplete: (postId: number) => void
}

export const CreateGroupTradePostBottomSheet: React.FC<Props> = ({
    enabled,
    theme,
    submitForm,
    setLoadingEnabled,
    onClose,
    onSubmitComplete,
}): JSX.Element => {
    const styles = createBottomSheetStyles(theme)
    const [chatName, setChatName] = useState('')
    const [accordionExpanded, setAccordionExpanded] = useState(true)

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                console.log('keyboard show')
                setAccordionExpanded(false)
            },
        )

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                console.log('keyboard hide')
                setAccordionExpanded(true)
            },
        )

        return () => {
            keyboardDidHideListener.remove()
            keyboardDidShowListener.remove()
        }
    })

    useEffect(() => {
        setChatName(submitForm.trade.item)
    }, [submitForm])

    const onSubmit = () => {
        submitForm.chatRoomName = chatName
        setLoadingEnabled(true)
        createGroupTradePost(submitForm)
            .then(res => {
                onSubmitComplete(res.postId)
                // setLoadingEnabled(false)
            })
            .catch(err => {})
    }

    return (
        <BottomSheet enabled={enabled} theme={theme} onClose={onClose}>
            <View style={styles.container}>
                <Text style={styles.chatNameRequestLabel}>
                    생성할 공동구매 채팅방의 이름을 입력해 주세요.
                </Text>
                <TextInput
                    value={chatName}
                    style={styles.chatNameInputText}
                    onChangeText={text => setChatName(text)}
                />
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => onSubmit()}>
                    <Text style={styles.submitButtonText}>거래글 생성하기</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                        style={styles.tradeInfoContainer}
                        onPress={() =>
                            setAccordionExpanded(!accordionExpanded)
                        }>
                        <Text style={styles.tradeInfoLabel}>거래 정보</Text>
                        <IcAngleDown />
                    </TouchableOpacity> */}
                <Accordion
                    expanded={accordionExpanded}
                    onToggle={() => setAccordionExpanded(!accordionExpanded)}
                    containerStyle={styles.tradeInfoContainer}
                    headerTitle='거래 정보'
                    theme={theme}>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemLabel}>상품명</Text>
                            <Text style={styles.itemText}>
                                {submitForm.trade.item}
                            </Text>
                        </View>
                        <View style={styles.secondaryItemContainer}>
                            <Text style={styles.secondaryItemLabel}>
                                카테고리
                            </Text>
                            <Text style={styles.secondaryItemText}>
                                {submitForm.trade.tag}
                            </Text>
                        </View>
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemLabel}>총 가격</Text>
                            <Text style={styles.itemText}>
                                {submitForm.trade.price} 원
                            </Text>
                        </View>
                        <View style={styles.secondaryItemContainer}>
                            <Text style={styles.secondaryItemLabel}>
                                개당 가격
                            </Text>
                            <Text style={styles.secondaryItemText}>
                                {submitForm.trade.price /
                                    submitForm.trade.count}{' '}
                                원
                            </Text>
                        </View>
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemLabel}>총 수량</Text>
                            <Text style={styles.itemText}>
                                {submitForm.trade.count} 개
                            </Text>
                        </View>
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemLabel}>모집 인원 </Text>
                            <Text style={styles.itemText}>
                                {submitForm.trade.wanted} 명
                            </Text>
                        </View>
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemLabel}>마감 기한</Text>
                            <Text style={styles.itemText}>
                                D - {submitForm.trade.dueDate}
                            </Text>
                        </View>
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemLabel}>거래 위치</Text>
                            <Text style={styles.itemText}>
                                {submitForm.trade.location}
                            </Text>
                        </View>
                    </ScrollView>
                </Accordion>
            </View>
        </BottomSheet>
    )
}

const createBottomSheetStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            marginTop: 10,
            marginHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        chatNameRequestLabel: {
            width: '100%',
            color: theme.TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic',
            marginBottom: 10,
        },
        chatNameInputText: {
            color: theme.TEXT,
            borderBottomColor: baseColors.GRAY_1,
            borderBottomWidth: 1,
            width: '100%',
            fontSize: 14,
            fontFamily: 'NanumGothic',
            marginBottom: 20,
        },
        submitButton: {
            width: '100%',
            backgroundColor: theme.BUTTON_BG,
            padding: 16,
            borderRadius: 5,
            alignItems: 'center',
        },
        submitButtonText: {
            color: theme.BUTTON_TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
        tradeInfoContainer: {
            width: '75%',
            marginTop: 20,
        },
        tradeInfoLabel: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic-Bold',
            marginEnd: 10,
        },
        scrollView: {
            height: 200,
            marginTop: 10,
        },
        itemContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            paddingVertical: 16,
            borderRadius: 5,
        },
        itemLabel: {
            color: theme.TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
        itemText: {
            color: theme.TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
        secondaryItemContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            paddingHorizontal: 6,
            marginBottom: 10,
            borderRadius: 5,
        },
        secondaryItemLabel: {
            color: theme.TEXT_SECONDARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
        secondaryItemText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
    })

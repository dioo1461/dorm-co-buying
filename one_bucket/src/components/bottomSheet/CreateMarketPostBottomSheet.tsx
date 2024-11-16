import { baseColors, Icolor } from '@/constants/colors'
import BottomSheet from './BottomSheet'
import {
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    Keyboard,
} from 'react-native'

import { useEffect, useState } from 'react'
import { CreateMarketPostRequestBody } from '@/data/request/market/CreateMarketPostBody'
import { createMarketPost } from '@/apis/marketService'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import Accordion from '../Accordion'
import IcAngleDown from '@/assets/drawable/ic-angle-down.svg'

interface Props {
    enabled: boolean
    theme: Icolor
    submitForm: CreateMarketPostRequestBody
    onClose: () => void
    onSubmitComplete: (postId: number) => void
}

export const CreateMarketPostBottomSheet: React.FC<Props> = ({
    enabled,
    theme,
    submitForm,
    onClose,
    onSubmitComplete,
}): JSX.Element => {
    const styles = createStyles(theme)
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
        setChatName(submitForm.tradeCreateDto.item)
    }, [submitForm])

    const onSubmit = () => {
        submitForm.chatRoomName = chatName
        createMarketPost(submitForm)
            .then(res => {
                onSubmitComplete(res.postId)
            })
            .catch(err => {})
    }

    return (
        <BottomSheet
            enabled={enabled}
            theme={theme}
            jsxElement={() => (
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
                        <Text style={styles.submitButtonText}>
                            거래글 생성하기
                        </Text>
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
                        onToggle={() =>
                            setAccordionExpanded(!accordionExpanded)
                        }
                        containerStyle={styles.tradeInfoContainer}
                        headerTitle='거래 정보'
                        theme={theme}>
                        <ScrollView style={styles.scrollView}>
                            <View style={styles.itemContainer}>
                                <Text style={styles.itemLabel}>상품명</Text>
                                <Text style={styles.itemText}>
                                    {submitForm.tradeCreateDto.item}
                                </Text>
                            </View>
                            <View style={styles.secondaryItemContainer}>
                                <Text style={styles.secondaryItemLabel}>
                                    카테고리
                                </Text>
                                <Text style={styles.secondaryItemText}>
                                    {submitForm.tradeCreateDto.tag}
                                </Text>
                            </View>
                            <View style={styles.itemContainer}>
                                <Text style={styles.itemLabel}>총 가격</Text>
                                <Text style={styles.itemText}>
                                    {submitForm.tradeCreateDto.price} 원
                                </Text>
                            </View>
                            <View style={styles.secondaryItemContainer}>
                                <Text style={styles.secondaryItemLabel}>
                                    개당 가격
                                </Text>
                                <Text style={styles.secondaryItemText}>
                                    {submitForm.tradeCreateDto.price /
                                        submitForm.tradeCreateDto.count}{' '}
                                    원
                                </Text>
                            </View>
                            <View style={styles.itemContainer}>
                                <Text style={styles.itemLabel}>총 수량</Text>
                                <Text style={styles.itemText}>
                                    {submitForm.tradeCreateDto.count} 개
                                </Text>
                            </View>
                            <View style={styles.itemContainer}>
                                <Text style={styles.itemLabel}>모집 인원 </Text>
                                <Text style={styles.itemText}>
                                    {submitForm.tradeCreateDto.wanted} 명
                                </Text>
                            </View>
                            <View style={styles.itemContainer}>
                                <Text style={styles.itemLabel}>마감 기한</Text>
                                <Text style={styles.itemText}>
                                    D - {submitForm.tradeCreateDto.dueDays}
                                </Text>
                            </View>
                            <View style={styles.itemContainer}>
                                <Text style={styles.itemLabel}>거래 위치</Text>
                                <Text style={styles.itemText}>
                                    {submitForm.tradeCreateDto.location}
                                </Text>
                            </View>
                        </ScrollView>
                    </Accordion>
                </View>
            )}
            onClose={onClose}
        />
    )
}

const createStyles = (theme: Icolor) =>
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

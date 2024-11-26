import { baseColors, Icolor, lightColors } from '@/constants/colors'
import { StyleSheet } from 'react-native'

export const createSignUpStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 20,
            backgroundColor: theme.BG,
        },
        headerContainer: {
            marginTop: 10,
        },
        backButton: {
            paddingVertical: 24,
            paddingHorizontal: 18,
            // position: 'absolute',
        },
        title: {
            fontSize: 26,
            color: theme.TEXT,
            fontFamily: 'NanumGothic',
            lineHeight: 34,
            marginBottom: 14,
        },
        currentStep: {
            color: theme === lightColors ? baseColors.SCHOOL_BG : 'white',
            fontFamily: 'NanumGothic',
            fontSize: 12,
            marginBottom: 10,
        },
        subStep: {
            fontSize: 12,
            color: theme.TEXT_TERTIARY,
            fontFamily: 'NanumGothic',
            marginBottom: 10,
        },
    })

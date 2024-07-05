import { baseColors } from '@/constants/colors'
import { StyleSheet } from 'react-native'

export const signUpHeaderStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 40,
        backgroundColor: 'white',
    },
    headerContainer: {
        marginTop: 60,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    title: {
        fontSize: 26,
        color: 'black',
        fontFamily: 'NanumGothic',
        lineHeight: 34,
        marginBottom: 14,
    },
    currentStep: {
        color: baseColors.SCHOOL_BG,
        fontSize: 14,
        fontFamily: 'NanumGothic',
        marginBottom: 10,
    },
    subStep: {
        fontSize: 14,
        color: baseColors.GRAY_1,
        fontFamily: 'NanumGothic',
        marginBottom: 10,
    },
})

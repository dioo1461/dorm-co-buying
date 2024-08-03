import { baseColors } from '@/constants/colors'
import { StyleSheet } from 'react-native'

export const signUpStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 24,
        backgroundColor: 'white',
    },
    headerContainer: {
        marginTop: 10,
    },
    backButton: {
        // position: 'absolute',
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
        fontSize: 12,
        fontFamily: 'NanumGothic',
        marginBottom: 10,
    },
    subStep: {
        fontSize: 12,
        color: baseColors.GRAY_1,
        fontFamily: 'NanumGothic',
        marginBottom: 10,
    },
})

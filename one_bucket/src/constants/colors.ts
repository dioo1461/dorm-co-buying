const schoolColors = {
    HONGIK_NAVY: '#002c62',
    HONGIK_DARK_NABY: '#001f4d',
    HONGIK_TEXT: '#FFFFFF',
}

export const baseColors = {
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    SCHOOL_BG: schoolColors.HONGIK_NAVY,
    SCHOOL_BG_DARKER: schoolColors.HONGIK_NAVY,
    SCHOOL_TEXT: schoolColors.HONGIK_TEXT,
    GRAY_1: '#808080',
    GRAY_2: '#D9D9D9',
    GRAY_3: '#F0F0F0',
    RED: '#FF0000',
}

export type Icolor = {
    BG: string
    ICON_BG: string
    ICON_BG_DARKER: string
    ICON_TEXT: string
    TEXT_PRIMARY: string
    TEXT_SECONDARY: string
    TAB_TEXT: string
    TAG_TEXT: string
    TAG_BG: string
    BORDER: string
    GROUPED_CONTENTS_BG: string
}

export const lightColors: Icolor = {
    BG: baseColors.WHITE,
    ICON_BG: baseColors.SCHOOL_BG,
    ICON_BG_DARKER: baseColors.SCHOOL_BG_DARKER,
    ICON_TEXT: baseColors.SCHOOL_TEXT,
    TEXT_PRIMARY: baseColors.BLACK,
    TEXT_SECONDARY: baseColors.GRAY_3,
    TAB_TEXT: baseColors.GRAY_3,
    TAG_TEXT: baseColors.WHITE,
    TAG_BG: baseColors.GRAY_2,
    BORDER: baseColors.GRAY_2,
    GROUPED_CONTENTS_BG: baseColors.GRAY_1,
}

export const darkColors: Icolor = {
    BG: baseColors.WHITE,
    ICON_BG: baseColors.SCHOOL_BG,
    ICON_BG_DARKER: baseColors.SCHOOL_BG_DARKER,
    ICON_TEXT: baseColors.SCHOOL_TEXT,
    TEXT_PRIMARY: baseColors.BLACK,
    TEXT_SECONDARY: baseColors.GRAY_3,
    TAB_TEXT: baseColors.GRAY_3,
    TAG_TEXT: baseColors.WHITE,
    TAG_BG: baseColors.GRAY_2,
    BORDER: baseColors.GRAY_2,
    GROUPED_CONTENTS_BG: baseColors.GRAY_1,
}

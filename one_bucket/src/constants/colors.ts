const schoolColors = {
    HONGIK_NAVY: '#002c62',
    HONGIK_LIGHT_NAVY: '#285792',
    HONGIK_DARK_NAVY: '#001f4d',
    HONGIK_TEXT: '#FFFFFF',
}

export const baseColors = {
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    DARK_BG: '#141414',
    SCHOOL_BG: schoolColors.HONGIK_NAVY,
    SCHOOL_BG_DARK: schoolColors.HONGIK_NAVY,
    SCHOOL_BG_LIGHT: schoolColors.HONGIK_LIGHT_NAVY,
    SCHOOL_TEXT: schoolColors.HONGIK_TEXT,
    GRAY_0: '#303030',
    GRAY_1: '#505050',
    GRAY_2: '#808080',
    GRAY_3: '#C0C0C0',
    GRAY_4: '#F0F0F0',
    LIGHT_RED: '#FF7070',
    LIGHT_BLUE: '#699BF7',
}

export type Icolor = {
    BG: string
    BG_SECONDARY: string
    HEADER_BG: string
    HEADER_TEXT: string
    TAB_BG: string
    BUTTON_BG: string
    BUTTON_BG_DARKER: string
    BUTTON_TEXT: string
    BUTTON_SECONDARY_BG: string
    BUTTON_SECONDARY_BG_DARKER: string
    BUTTON_SECONDARY_TEXT: string
    TEXT: string
    TEXT_SECONDARY: string
    TEXT_TERTIARY: string
    TEXT_QUARTERNARY: string
    TAB_TEXT: string
    TAG_TEXT: string
    TAG_BG: string
    BORDER: string
    GROUPED_CONTENTS_BG: string
    ACCENT_TEXT: string
}

export const lightColors: Icolor = {
    BG: baseColors.WHITE,
    BG_SECONDARY: baseColors.GRAY_4,
    HEADER_BG: baseColors.SCHOOL_BG,
    HEADER_TEXT: baseColors.WHITE,
    TAB_BG: baseColors.WHITE,

    BUTTON_BG: baseColors.SCHOOL_BG,
    BUTTON_BG_DARKER: baseColors.SCHOOL_BG_DARK,
    BUTTON_TEXT: baseColors.SCHOOL_TEXT,
    BUTTON_SECONDARY_BG: baseColors.GRAY_3,
    BUTTON_SECONDARY_BG_DARKER: baseColors.GRAY_2,
    BUTTON_SECONDARY_TEXT: baseColors.GRAY_1,

    TEXT: baseColors.BLACK,
    TEXT_SECONDARY: baseColors.GRAY_1,
    TEXT_TERTIARY: baseColors.GRAY_2,
    TEXT_QUARTERNARY: baseColors.GRAY_3,
    TAB_TEXT: baseColors.GRAY_3,
    TAG_TEXT: baseColors.WHITE,
    TAG_BG: baseColors.GRAY_2,

    BORDER: baseColors.GRAY_2,
    GROUPED_CONTENTS_BG: baseColors.GRAY_1,
    ACCENT_TEXT: '#FF7070',
}

export const darkColors: Icolor = {
    BG: baseColors.DARK_BG,
    BG_SECONDARY: baseColors.GRAY_0,
    HEADER_BG: baseColors.GRAY_0,
    HEADER_TEXT: baseColors.WHITE,

    TAB_BG: baseColors.DARK_BG,

    BUTTON_BG: baseColors.SCHOOL_BG,
    BUTTON_BG_DARKER: baseColors.SCHOOL_BG_DARK,
    BUTTON_TEXT: baseColors.SCHOOL_TEXT,
    BUTTON_SECONDARY_BG: baseColors.GRAY_3,
    BUTTON_SECONDARY_BG_DARKER: baseColors.GRAY_2,
    BUTTON_SECONDARY_TEXT: baseColors.GRAY_1,

    TEXT: baseColors.WHITE,
    TEXT_SECONDARY: baseColors.GRAY_3,
    TEXT_TERTIARY: baseColors.GRAY_2,
    TEXT_QUARTERNARY: baseColors.GRAY_1,
    TAB_TEXT: baseColors.GRAY_3,
    TAG_TEXT: baseColors.WHITE,
    TAG_BG: baseColors.GRAY_2,

    BORDER: baseColors.GRAY_2,
    GROUPED_CONTENTS_BG: baseColors.GRAY_1,
    ACCENT_TEXT: '#FF7070',
}

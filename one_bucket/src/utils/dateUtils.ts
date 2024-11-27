export const convertToKoreanTime = (utcDate: Date | String): Date => {
    const koreanTimeOffset = 9 * 60 * 60 * 1000 // 9시간을 밀리초로 변환
    // 한국 시간으로 변환 (UTC+9:00)
    if (typeof utcDate === 'string') {
        utcDate = new Date(utcDate)
    }
    const koreanDate = new Date((utcDate as Date).getTime() + koreanTimeOffset)

    return koreanDate
}

export const getDDays = (date: Date): number => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
}

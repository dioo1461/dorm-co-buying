export const formatTimeAgo = (createdISODate: string): string => {
    const createdDate = new Date(createdISODate)
    const now = new Date()
    const diffInSeconds = Math.floor(
        (now.getTime() - createdDate.getTime()) / 1000,
    ) // 차이를 초로 계산

    const minutes = 60
    const hours = minutes * 60
    const days = hours * 24
    const weeks = days * 7
    const months = days * 30
    const years = days * 365

    if (diffInSeconds < minutes) {
        return `${diffInSeconds}초 전`
    } else if (diffInSeconds < hours) {
        const diffInMinutes = Math.floor(diffInSeconds / minutes)
        return `${diffInMinutes}분 전`
    } else if (diffInSeconds < days) {
        const diffInHours = Math.floor(diffInSeconds / hours)
        return `${diffInHours}시간 전`
    } else if (diffInSeconds < weeks) {
        const diffInDays = Math.floor(diffInSeconds / days)
        return `${diffInDays}일 전`
    } else if (diffInSeconds < months) {
        const diffInWeeks = Math.floor(diffInSeconds / weeks)
        return `${diffInWeeks}주 전`
    } else if (diffInSeconds < years) {
        const diffInMonths = Math.floor(diffInSeconds / months)
        return `${diffInMonths}달 전`
    } else {
        const diffInYears = Math.floor(diffInSeconds / years)
        return `${diffInYears}년 전`
    }
}

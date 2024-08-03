export class StringFilter {
    static sqlFilter(text: string) {
        return text.replaceAll(/[;'"%_&|^#*!<>=?\\\s]/g, '')
    }

    static removeSpaces(text: string) {
        return text.replaceAll(/\s/g, '')
    }

    static removeSpecials(text: string) {
        return text.replaceAll(/[^\wㄱ-힣]/g, '')
    }

    static numericFilter(text: string) {
        return text.replaceAll(/[^0-9]/g, '')
    }

    static alphabetFilter(text: string) {
        return text.replaceAll(/[^a-zA-Z]/g, '')
    }
}

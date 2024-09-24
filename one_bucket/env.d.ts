/** !!! .env.local 작성 시 주의점 !!!
 *
 * 1. 공백이 있으면 안 됨
 * - BASE_URL=http://api.example.com (o)
 * - BASE_URL = http://api.example.com (x)
 *
 * 2. 따옴표는 사용하지 않음
 * - BASE_URL=http://api.example.com (o)
 * - BASE_URL="http://api.example.com" (x)
 *
 * 3. 환경변수 변경이 적용되지 않을 경우, npx react-native start --reset-cache
 *  명령어로 metro 서버를 시작해 볼 것
 *
 */

declare module '@env' {
    export const BASE_URL: string
    export const CHAT_BASE_URL: string
    export const STORAGE_BASE_URL: string
}

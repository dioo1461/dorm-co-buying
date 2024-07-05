/** !!! .env.local 작성 시 주의점 !!!
 *
 * 1. 공백이 있으면 안 됨
 * - BASE_URL=http://api.example.com (o)
 * - BASE_URL = http://api.example.com (x)
 *
 * 2. 따옴표는 사용하지 않음
 * - BASE_URL=http://api.example.com (o)
 * - BASE_URL="http://api.example.com" (x)
 */

declare module '@env' {
    export const BASE_URL: string
}

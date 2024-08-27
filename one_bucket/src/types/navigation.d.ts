/** compile error : useNavigation의 인수로 String 전달 시 하기의 문법 에러 발생
 * RN > 0.65 버전에서 발생하는 문제라고 함.
 * 
 * No overload matches this call.
  Argument of type '[string]' is not assignable to parameter of type 'never'.
  Overload 2 of 2, '(options: never): void', gave the following error.
    Argument of type 'string' is not assignable to parameter of type 'never'.ts(2769)
 *
 * 해결방안 : https://spin.atomicobject.com/not-assignable-parameter-never/   
 */

import { NavigationProp, ParamListBase } from '@react-navigation/native'

declare global {
    namespace ReactNavigation {
        interface RootParamList extends ParamListBase {}
    }
}

export function useNavigation<T extends NavigationProp>(): T

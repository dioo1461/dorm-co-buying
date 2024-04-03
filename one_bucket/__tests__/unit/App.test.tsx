/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../../App';
import { it } from '@jest/globals';
import { fireEvent, render, screen, userEvent, waitFor } from '@testing-library/react-native'
import { act } from 'react-test-renderer';


describe('Tab Navigation', () => {
  it('move to Home', async () => {
    render(
      <App />
    )
    // warning: It is recommended to use userEvent with fake timers
    // 원인: userEvent는 동작을 호출 시 때 실제 시간을 소요하는데, 이 때문에 
    //  테스팅 시간이 불필요하게 길어질 수 있다는 경고.
    // 해결: jest.useFakeTimers() 를 선언하여 가짜 타이머로 
    //  userEvent 동작 시 실제 시간이 소요되지 않도록 할 수 있음.
    jest.useFakeTimers()
    const event = userEvent.setup()

    // error: Found multiple elements with testID: tabIcon-{routes}
    // > userEvent.press(screen.getByTestId('tabIcon-홈'))
    // 원인: tabNavigation이 icon을 두 번 렌더링하는 것이 기본 동작이었음.
    // 해결: getAllByTestId()로 대체하여 해결.
    // https://github.com/react-navigation/react-navigation/issues/546
    const homeTabIcon = screen.getAllByTestId('tabIcon-홈')

    // error: 'Unable to find node on an unmounted component.'
    // 원인: screen.getAllByTestId가 mount되기 전에 userEvent.press를 호출하여 생긴 에러였음.
    // 해결: await waitFor() 로 press 이벤트를 감싸주어 해결.
    await waitFor(() => event.press(homeTabIcon[0]))
    
    await waitFor(()=> expect(screen.getAllByTestId('tabIcon-홈')).toBeTruthy())
  })
})

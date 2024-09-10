jest.mock('@stomp/stompjs', () => ({
    Stomp: {
        over: jest.fn().mockReturnValue({
            connect: jest.fn(),
            subscribe: jest.fn(),
            send: jest.fn(),
            disconnect: jest.fn(),
        }),
    },
}))

describe('Chat', () => {
    it('websocket connection', () => {})
})

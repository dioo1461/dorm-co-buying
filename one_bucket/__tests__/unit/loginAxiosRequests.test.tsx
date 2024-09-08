import { requestLogin, checkPassword } from 'apis/auth/loginAxiosRequests'

describe('requestLogin', () => {
    it('should return true if the login request is successful', async () => {
        // Mock the axios post method
        const mockPost = jest
            .fn()
            .mockResolvedValue({
                data: { accessToken: 'token', refreshToken: 'refresh' },
            })
        jest.mock('utils/axiosFactory', () => ({
            defaultAxios: { post: mockPost },
        }))

        // Mock the storeAccessToken and storeRefreshToken methods
        const mockStoreAccessToken = jest.fn()
        const mockStoreRefreshToken = jest.fn()
        jest.mock('utils/accessTokenMethods', () => ({
            storeAccessToken: mockStoreAccessToken,
            storeRefreshToken: mockStoreRefreshToken,
        }))

        // Call the requestLogin function
        const result = await requestLogin({
            username: 'test',
            password: 'password',
        })

        // Check the result and function calls
        expect(result).toBe(true)
        expect(mockPost).toHaveBeenCalledWith('/sign-in', {
            username: 'test',
            password: 'password',
        })
        expect(mockStoreAccessToken).toHaveBeenCalledWith('token')
        expect(mockStoreRefreshToken).toHaveBeenCalledWith('refresh')
    })

    it('should return false if the login request fails', async () => {
        // Mock the axios post method to throw an error
        const mockPost = jest
            .fn()
            .mockRejectedValue(new Error('Request failed'))
        jest.mock('utils/axiosFactory', () => ({
            defaultAxios: { post: mockPost },
        }))

        // Call the requestLogin function
        const result = await requestLogin({
            username: 'test',
            password: 'password',
        })

        // Check the result
        expect(result).toBe(false)
    })
})

describe('checkPassword', () => {
    it('should return true if the password is valid', async () => {
        // Mock the axios post method
        const mockPost = jest.fn().mockResolvedValue({ data: true })
        jest.mock('utils/axiosFactory', () => ({
            authAxios: { post: mockPost },
        }))

        // Call the checkPassword function
        const result = await checkPassword('password')

        // Check the result and function calls
        expect(result).toBe(true)
        expect(mockPost).toHaveBeenCalledWith('/auth/check-password', {
            password: 'password',
        })
    })

    it('should throw an error if the API request fails', async () => {
        // Mock the axios post method to throw an error
        const mockPost = jest
            .fn()
            .mockRejectedValue(new Error('Request failed'))
        jest.mock('utils/axiosFactory', () => ({
            authAxios: { post: mockPost },
        }))

        // Call the checkPassword function and expect it to throw an error
        await expect(checkPassword('password')).rejects.toThrow(
            'Request failed',
        )
    })
})

import { SignupStatus } from '../contexts/User'

declare global {
    interface Window {
        ethereum: any
    }
}

const useSignupWithWallet = (
    navigate: (path: string) => void,
    setSignupStatus: (param: SignupStatus) => void,
    handleWalletSignMessage: () => Promise<void>,
    signup: (fromServer: boolean) => Promise<void>,
    setIsLogin: (param: boolean) => void
) => {
    const signUpWithWallet = async () => {
        try {
            if (!window.ethereum) {
                throw new Error('請安裝MetaMask錢包')
            }
            await handleWalletSignMessage()
            setSignupStatus('pending')
            navigate('/')
            await signup(false)
            console.log('has signed up')
            setSignupStatus('success')
            localStorage.setItem('loginStatus', 'success')
            setIsLogin(true)
        } catch (error) {
            setSignupStatus('error')
            console.error(error)
        }
    }

    return signUpWithWallet
}

export default useSignupWithWallet

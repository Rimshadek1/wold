import { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from './userContext';
import { userTransaction } from '../Service/Apis';

const WalletContext = createContext({
    balance: 0,
    setBalance: () => { },
    isLoading: false,
});

export const WalletProvider = ({ children }) => {
    const [balance, setBalance] = useState(0);
    const { userData } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await userTransaction(userData.id);
                if (response.status === 200) {
                    setBalance(response.data.balance);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userData?.id]);

    return (
        <WalletContext.Provider
            value={{ balance, setBalance, isLoading }}
        >
            {isLoading ? (
                <div>Loading wallet balance...</div>
            ) : (
                children
            )}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    return useContext(WalletContext);
};
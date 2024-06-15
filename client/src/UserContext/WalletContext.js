import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from './userContext';
import { userTransaction } from '../Service/Apis';

const WalletContext = createContext({
    balance: 0,
    setBalance: () => { },
    isLoading: false, // Add loading state
});

export const WalletProvider = ({ children }) => {
    const [balance, setBalance] = useState(0);
    const { userData } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true); // Set initial loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await userTransaction(userData.id);
                if (response.status === 200) {
                    setBalance(response.data.balance);
                }
            } catch (error) {
                toast.error('JWT token is not present');
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







// import { createContext, useContext, useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { UserContext } from './userContext';
// import { userTransaction } from '../Service/Apis';


// const WalletContext = createContext();

// export const WalletProvider = ({ children }) => {
//     const [balance, setBalance] = useState(0);
//     const { userData } = useContext(UserContext);

//     useEffect(() => {
//         fetchData();
//     }, []);
//     const fetchData = async () => {
//         try {
//             const response = await userTransaction(userData.id);
//             if (response.status === 200) {
//                 setBalance(response.data.balance)
//             }
//         } catch (error) {
//             toast.error('JWT token is not present');
//         }
//     }
//     console.log(balance);
//     console.log(userData);
//     return (
//         <WalletContext.Provider value={{ balance, setBalance }}>
//             {children}
//         </WalletContext.Provider>
//     );
// };

// export const useWallet = () => {
//     return useContext(WalletContext);
// };

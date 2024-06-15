import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
export const UserContext = createContext({});

function UserContextProvider({ children }) {
    const authToken = localStorage.getItem('authToken');
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        if (authToken) {
            try {
                const decodedToken = jwtDecode(authToken);
                setUserData(decodedToken);
            } catch (error) {
                console.error('Error decoding JWT token:', error);
            }
        }
    }, [authToken]);

    return (
        <UserContext.Provider value={{ userData }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;

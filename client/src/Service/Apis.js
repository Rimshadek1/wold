import { commonrequest } from "./ApiCall";


export const sendEmail = async (data) => {
    return await commonrequest("POST", `/sendmail`, data)
}
export const checkOtp = async (data) => {
    return await commonrequest("POST", `/checkotp`, data)
}
export const createUser = async (data) => {
    return await commonrequest("POST", `/createuser`, data)
}
export const loginUsers = async (data) => {
    return await commonrequest("POST", `/loginuser`, data)
}

export const getTrade = async (id) => {
    return await commonrequest("GET", `/gettrade/${id}`)
}
export const postRequestAddMoney = async (data) => {
    return await commonrequest("POST", `/postRequestAddMoney`, data)
}
export const verifyPayment = async (data) => {
    return await commonrequest("POST", `/verifyPayment`, data)
}
export const withdrawRequest = async (data) => {
    return await commonrequest("POST", `/withdrawRequest`, data);
}
export const userTransaction = async (id) => {
    return await commonrequest("GET", `/usertransaction/${id}`);
}
export const purchase = async (data) => {
    return await commonrequest("POST", `/purchase`, data);
}
export const portfolioValue = async (id) => {
    return await commonrequest("GET", `/portfolioValue/${id}`);
}
export const mobileOtpSent = async (data) => {
    return await commonrequest("POST", `/mobileOtpSent`, data);
}
export const mobileotpveri = async (data) => {
    return await commonrequest("POST", `/mobileotpveri`, data);
}
export const bankDetails = async (data) => {
    return await commonrequest("POST", `/bankDetails`, data);
}
export const detailsAdhaar = async (data) => {
    return await commonrequest("POST", `/detailsAdhaar`, data);
}
export const profileAdd = async (data) => {
    return await commonrequest("POST", `/profileAdd`, data);
}
export const profileGet = async (id) => {
    return await commonrequest("GET", `/profileGet/${id}`);
}
export const investing = async (data) => {
    return await commonrequest("POST", `/investing`, data);
}
export const forgetPasswords = async (data) => {
    return await commonrequest("POST", `/forgetpasswords`, data);
}
export const ownerDashData = async (id) => {
    return await commonrequest("GET", `/ownerDashData/${id}`);
}
export const otpChecking = async (data) => {
    return await commonrequest("POST", `/otpChecking`, data);
}
export const changePass = async (data) => {
    return await commonrequest("POST", `/changePass`, data);
}

//admin

export const generateCode = async (data) => {
    return await commonrequest("POST", `/generateCode`, data);
}
export const addTrades = async (data) => {
    return await commonrequest("POST", `/addtrades`, data)
}
export const getTrades = async () => {
    return await commonrequest("GET", `/gettrades`)
}

export const viewTradeProfit = async (id) => {
    return await commonrequest("GET", `/viewTradeProfit/${id}`);
};

export const tradeProfit = async (data) => {
    return await commonrequest("POST", `/tradeProfit`, data);
};
export const pupdate10 = async (data) => {
    return await commonrequest("POST", `/pupdate10`, data);
};
export const viewpupdate10 = async () => {
    return await commonrequest("GET", `/viewpupdate10 `);
};
export const adhaarveri = async () => {
    return await commonrequest("GET", `/adhaarveri`)
}
export const adhaarverification = async (data) => {
    return await commonrequest("POST", `/adhaarverification`, data);
};
export const adhaarDelete = async (data) => {
    return await commonrequest("POST", `/adhaarDelete`, data);
};

export const getWithdrwalRequest = async () => {
    return await commonrequest("GET", `/getWithdrwalRequests`);
};
export const acceptWithdrawal = async (data) => {
    return await commonrequest("POST", `/acceptWithdrawals`, data);
};
export const deleteWithdrawal = async (data) => {
    return await commonrequest("POST", `/deleteWithdrawal`, data);
};
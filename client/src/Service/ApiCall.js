// import axios from "axios";

// export const commonrequest = async (method, url, data, headers) => {
//     try {
//         const config = {
//             method: method,
//             url: url,
//             data: data,
//             headers: headers || { "Content-Type": "multipart/form-data" },
//         };

//         const response = await axios(config);
//         return response;
//     } catch (error) {
//         throw error;
//     }
// };
import axios from "axios";

export const commonrequest = async (method, url, data, headers) => {
    try {
        let config = {
            method: method,
            url: url,
            headers: headers || {},
        };

        // Check if data is present
        if (data) {
            // Check if data is FormData (for multipart/form-data)
            if (data instanceof FormData) {
                config = {
                    ...config,
                    data: data,
                };
            } else {
                // For JSON data (application/json)
                config = {
                    ...config,
                    data: data,
                    headers: {
                        ...config.headers,
                        "Content-Type": "application/json",
                    },
                };
            }
        }

        const response = await axios(config);
        return response;
    } catch (error) {
        throw error;
    }
};


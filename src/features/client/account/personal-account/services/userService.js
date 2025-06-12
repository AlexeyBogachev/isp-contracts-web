import axios from 'axios';

export const fetchUserDetails = async (userId) => {
    if (!userId) return null;

    try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
            withCredentials: true
        });
        const userDetails = response.data;

        const naturalPersonResponse = await axios.get(
            `http://localhost:3000/api/natural-persons/${userId}`,
            { withCredentials: true }
        );

        if (naturalPersonResponse.data) {
            return {
                userDetails,
                clientDetails: naturalPersonResponse.data,
                clientType: 'natural'
            };
        }

        const legalEntityResponse = await axios.get(
            `http://localhost:3000/api/legal-entities/${userId}`,
            { withCredentials: true }
        );

        if (legalEntityResponse.data) {
            return {
                userDetails,
                clientDetails: legalEntityResponse.data,
                clientType: 'legal'
            };
        }

        return {
            userDetails,
            clientDetails: null,
            clientType: null
        };

    } catch (error) {
        if (error.response?.status >= 500) {
            console.error('Ошибка сервера при получении данных пользователя:', error);
        }
        throw error;
    }
}; 
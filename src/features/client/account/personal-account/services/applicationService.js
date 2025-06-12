import axios from 'axios';

export const fetchApplicationStatus = async (userId) => {
    if (!userId) return null;

    try {
        const applicationsResponse = await axios.get(
            'http://localhost:3000/api/applications',
            { withCredentials: true }
        );

        const userApplications = applicationsResponse.data.filter(
            app => app.id_user === userId
        );

        if (userApplications.length > 0) {
            const latestApplication = userApplications.reduce((latest, current) => {
                return new Date(current.date_of_creation) > new Date(latest.date_of_creation)
                    ? current
                    : latest;
            });

            if (latestApplication.status_application?.status_application_name) {
                return {
                    id: latestApplication.id_application,
                    status: latestApplication.status_application.status_application_name,
                    date: new Date(latestApplication.date_of_creation).toLocaleDateString(),
                    address: latestApplication.connection_address,
                    tariff: latestApplication.tariff.tariff_name
                };
            }
        }

        return null;
    } catch (error) {
        console.error('Ошибка при получении статуса заявки:', error);
        throw error;
    }
}; 
import axios from 'axios';

export const fetchContractDetails = async (userId) => {
    if (!userId) return null;

    try {
        const contractsResponse = await axios.get(
            'http://localhost:3000/api/contracts',
            { withCredentials: true }
        );

        const userContracts = contractsResponse.data.filter(
            contract => contract.application?.id_user === userId
        );

        if (userContracts.length > 0) {
            const latestContract = userContracts.reduce((latest, current) => {
                return new Date(current.date_of_conclusion) > new Date(latest.date_of_conclusion)
                    ? current
                    : latest;
            });

            return {
                id: latestContract.id_contract,
                applicationId: latestContract.application.id_application,
                status: latestContract.status_contract.status_contract_name,
                faceAccount: latestContract.face_account,
                totalCost: latestContract.total_cost,
                dateOfConclusion: new Date(latestContract.date_of_conclusion).toLocaleDateString(),
                dateOfTermination: latestContract.date_of_termination
                    ? new Date(latestContract.date_of_termination).toLocaleDateString()
                    : 'Не указано',
                contractTerms: latestContract.contract_terms || 'Не указано',
                connectionAddress: latestContract.application.connection_address,
                costApplication: latestContract.application.cost_application,
                tariff: latestContract.application.tariff.tariff_name,
                speed: latestContract.application.tariff.speed_mbps,
                employeeName: `${latestContract.employee.surname} ${latestContract.employee.name} ${latestContract.employee.patronymic}`,
                userData: latestContract.application.user
            };
        }

        return null;
    } catch (error) {
        console.error('Ошибка при получении данных договора:', error);
        throw error;
    }
}; 
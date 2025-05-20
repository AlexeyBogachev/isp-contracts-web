import React, { useState, useEffect } from "react";
import axios from "axios";
import EditApplicationFormContent from "./EditApplicationFormContent";

const EditApplicationForm = ({ application, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    report_card_number: "",
    id_status_application: "",
    id_tariff: "",
    date_of_creation: "",
    price: ""
  });

  const [statusOptions, setStatusOptions] = useState([]);
  const [tariffOptions, setTariffOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [statusResponse, tariffResponse, employeeResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/status-applications", { withCredentials: true }),
          axios.get("http://localhost:3000/api/tariffs", { withCredentials: true }),
          axios.get("http://localhost:3000/api/employees", { withCredentials: true }),
        ]);
        setStatusOptions(statusResponse.data);
        setTariffOptions(tariffResponse.data);
        setEmployeeOptions(employeeResponse.data);
      } catch (err) {
        alert("Ошибка при загрузке данных: " + err.message);
      }
    };
    fetchOptions();

    if (application) {
      const localDate = new Date(application.date_of_creation);
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
      setFormData({
        report_card_number: application.report_card_number,
        id_status_application: application.id_status_application,
        id_tariff: application.id_tariff,
        date_of_creation: localDate.toISOString().split("T")[0],
        price: application.tariff.price
      });
    }
  }, [application]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateFaceAccount = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First update the application
      await axios.put(`http://localhost:3000/api/applications/${application.id_application}`, {
        report_card_number: formData.report_card_number,
        id_status_application: formData.id_status_application,
        id_tariff: formData.id_tariff,
        date_of_creation: formData.date_of_creation
      }, { withCredentials: true });

      // Update the tariff's price
      await axios.put(`http://localhost:3000/api/tariffs/${formData.id_tariff}`, {
        price: formData.price
      }, { withCredentials: true });

      // If status is changed to "Approved" (status ID 2), create a contract
      if (formData.id_status_application === "2") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const newContract = {
          id_status_contract: 1,
          report_card_number: formData.report_card_number,
          id_application: application.id_application,
          id_tariff: formData.id_tariff,
          face_account: generateFaceAccount(),
          total_cost: formData.price,
          date_of_conclusion: tomorrow.toISOString().split('T')[0],
        };

        await axios.post("http://localhost:3000/api/contracts", newContract, { withCredentials: true });
      }

      onUpdate();
      onClose();
    } catch (err) {
      alert("Ошибка при обновлении заявки: " + err.message);
    }
  };

  return (
    <EditApplicationFormContent
      formData={formData}
      statusOptions={statusOptions}
      tariffOptions={tariffOptions}
      employeeOptions={employeeOptions}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      onClose={onClose}
    />
  );
};

export default EditApplicationForm;
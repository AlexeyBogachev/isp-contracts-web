import React, { useState, useEffect } from "react";
import axios from "axios";
import EditApplicationFormContent from "./EditApplicationFormContent";

const EditApplicationForm = ({ application, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    report_card_number: "",
    id_status_application: "",
    id_tariff: "",
    date_of_creation: "",
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
      });
    }
  }, [application]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/applications/${application.id_application}`, formData, {
        withCredentials: true,
      });
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
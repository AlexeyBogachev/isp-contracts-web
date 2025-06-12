import { useState, useEffect } from "react";
import axios from "axios";
import EditContractNaturalPersonFormView from "./EditContractNaturalPersonForm.jsx";

const EditContractNaturalPerson = ({ contract, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id_status_contract: "",
    face_account: "",
    total_cost: "",
    date_of_conclusion: "",
    date_of_termination: "",
    contract_terms: "",
    connection_address: "",
    cost_application: "",
    id_tariff: ""
  });

  const [statusOptions, setStatusOptions] = useState([]);
  const [tariffOptions, setTariffOptions] = useState([]);

  const [errors, setErrors] = useState({
    face_account: "",
    cost_application: "",
    connection_address: ""
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [statusResponse, tariffResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/status-contracts", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/api/tariffs", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
            withCredentials: true,
          })
        ]);

        setStatusOptions(statusResponse.data);
        setTariffOptions(tariffResponse.data);

        if (contract) {
          const currentTariff = tariffResponse.data.find(
            (tariff) => tariff.tariff_name === contract.application.tariff.tariff_name
          );

          const currentStatus = statusResponse.data.find(
            (status) => status.status_contract_name === contract.status_contract?.status_contract_name
          );

          setFormData({
            id_status_contract: currentStatus?.id_status_contract || "",
            face_account: contract.face_account || "",
            total_cost: contract.total_cost || "",
            date_of_conclusion: contract.date_of_conclusion?.slice(0, 10) || "",
            date_of_termination: contract.date_of_termination?.slice(0, 10) || "",
            contract_terms: contract.contract_terms || "",
            connection_address: contract.application.connection_address || "",
            cost_application: contract.application.cost_application || "",
            id_tariff: currentTariff ? String(currentTariff.id_tariff) : ""
          });
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchOptions();
  }, [contract]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "face_account":
        if (value.length > 20) {
          error = "Лицевой счёт не может быть длиннее 20 символов";
        }
        break;
      case "cost_application":
        if (isNaN(value) || value < 0) {
          error = "Стоимость заявки не может быть отрицательной";
        }
        if (value > 100000) {
          error = "Стоимость заявки не может превышать 100 000 ₽";
        }
        break;
      case "connection_address":
        if (value.length < 10) {
          error = "Адрес подключения должен содержать минимум 10 символов";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    if (name === 'id_tariff' && value) {
      const selectedTariff = tariffOptions.find(tariff => tariff.id_tariff === Number(value));
      if (selectedTariff) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          total_cost: selectedTariff.price
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      face_account: validateField("face_account", formData.face_account),
      cost_application: validateField("cost_application", formData.cost_application),
      connection_address: validateField("connection_address", formData.connection_address)
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/contracts/${contract.id_contract}`, {
        id_status_contract: formData.id_status_contract,
        face_account: formData.face_account,
        total_cost: formData.total_cost,
        date_of_conclusion: formData.date_of_conclusion,
        date_of_termination: formData.date_of_termination,
        contract_terms: formData.contract_terms
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        withCredentials: true,
      });

      await axios.put(`http://localhost:3000/api/applications/${contract.application.id_application}`, {
        connection_address: formData.connection_address,
        cost_application: formData.cost_application,
        id_tariff: formData.id_tariff
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        withCredentials: true,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
      alert("Ошибка при сохранении изменений.");
    }
  };

  return (
    <EditContractNaturalPersonFormView
      contract={contract}
      formData={formData}
      errors={errors}
      statusOptions={statusOptions}
      tariffOptions={tariffOptions}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      onClose={onClose}
    />
  );
};

export default EditContractNaturalPerson;
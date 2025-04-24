import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EditContractLegalEntiti.module.css";

const EditContractLegalEntitiForm = ({ contract, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id_status_contract: "",
    face_account: "",
    total_cost: "",
    date_of_conclusion: "",
    date_of_termination: "",
    contract_terms: "",
  });

  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    if (contract && statusOptions.length) {
      const currentStatus = statusOptions.find(
        (status) => status.status_contract_name === contract.status_contract?.status_contract_name
      );
  
      setFormData({
        id_status_contract: currentStatus?.id_status_contract || "",
        face_account: contract.face_account || "",
        total_cost: contract.total_cost || "",
        date_of_conclusion: contract.date_of_conclusion?.slice(0, 10) || "",
        date_of_termination: contract.date_of_termination?.slice(0, 10) || "",
        contract_terms: contract.contract_terms || "",
      });
    }
  }, [contract, statusOptions]);

  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/status-contracts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          withCredentials: true,
        });
        setStatusOptions(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке статусов договора:", error);
      }
    };

    fetchStatusOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/contracts/${contract.id_contract}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        withCredentials: true,
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Ошибка при обновлении контракта:", error);
      alert("Ошибка при сохранении изменений.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Редактировать договор №{contract.id_contract}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Статус:
            <select
              name="id_status_contract"
              value={formData.id_status_contract}
              onChange={handleChange}
              required
            >
              <option value="">Выберите статус</option>
              {statusOptions.map((status) => (
                <option key={status.id_status_contract} value={status.id_status_contract}>
                  {status.status_contract_name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Лицевой счёт:
            <input name="face_account" value={formData.face_account} onChange={handleChange} required />
          </label>
          <label>
            Сумма:
            <input
              type="number"
              name="total_cost"
              value={formData.total_cost}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Дата заключения:
            <input type="date" name="date_of_conclusion" value={formData.date_of_conclusion} onChange={handleChange} required />
          </label>
          <label>
            Дата расторжения:
            <input type="date" name="date_of_termination" value={formData.date_of_termination} onChange={handleChange} />
          </label>
          <label>
            Условия:
            <textarea name="contract_terms" value={formData.contract_terms} onChange={handleChange} />
          </label>
          <div className={styles.buttons}>
            <button type="submit">Сохранить</button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContractLegalEntitiForm;
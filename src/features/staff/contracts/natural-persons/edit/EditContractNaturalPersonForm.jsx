import React from "react";
import styles from "./EditContractNaturalPerson.module.css";

const EditContractNaturalPersonForm = ({
    contract,
    formData,
    errors,
    statusOptions,
    tariffOptions,
    handleChange,
    handleSubmit,
    onClose
}) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Редактировать договор №{contract.id_contract}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className={styles.formColumn}>
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
                                Тариф:
                                <select
                                    name="id_tariff"
                                    value={formData.id_tariff}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Выберите тариф</option>
                                    {tariffOptions.map((tariff) => (
                                        <option
                                            key={tariff.id_tariff}
                                            value={tariff.id_tariff}
                                        >
                                            {tariff.tariff_name} - {tariff.speed_mbps} Мбит/с - {tariff.price} ₽
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Сумма договора:
                                <input
                                    type="text"
                                    value={`${formData.total_cost} ₽`}
                                    disabled
                                    className={styles.disabledInput}
                                />
                            </label>

                            <label>
                                Лицевой счёт:
                                <input
                                    name="face_account"
                                    value={formData.face_account}
                                    onChange={handleChange}
                                    required
                                    maxLength={20}
                                />
                                {errors.face_account && <span className={styles.errorText}>{errors.face_account}</span>}
                            </label>

                            <label>
                                Стоимость заявки (₽):
                                <input
                                    type="number"
                                    name="cost_application"
                                    value={formData.cost_application}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    max="100000"
                                />
                                {errors.cost_application && <span className={styles.errorText}>{errors.cost_application}</span>}
                            </label>
                        </div>

                        <div className={styles.formColumn}>
                            <label>
                                Адрес подключения:
                                <input
                                    name="connection_address"
                                    value={formData.connection_address}
                                    onChange={handleChange}
                                    required
                                    minLength={5}
                                />
                                {errors.connection_address && <span className={styles.errorText}>{errors.connection_address}</span>}
                            </label>

                            <label>
                                Дата заключения:
                                <input
                                    type="date"
                                    name="date_of_conclusion"
                                    value={formData.date_of_conclusion}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label>
                                Дата расторжения:
                                <input
                                    type="date"
                                    name="date_of_termination"
                                    value={formData.date_of_termination}
                                    onChange={handleChange}
                                />
                            </label>

                            <label>
                                Условия:
                                <textarea
                                    name="contract_terms"
                                    value={formData.contract_terms}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            type="submit"
                            className={styles.saveButton}
                            disabled={Object.values(errors).some(error => error !== "")}
                        >
                            Сохранить
                        </button>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditContractNaturalPersonForm;

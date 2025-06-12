import { useEffect, useState } from "react";
import axios from "axios";
import MenuForm from "./MenuForm";

const MenuPage = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/contracts", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
          }
        });

        const sortedContracts = response.data
          .sort((a, b) => new Date(b.application?.date_of_creation) - new Date(a.application?.date_of_creation))
          .slice(-15);

        setContracts(sortedContracts);
      } catch (error) {
        console.error("Ошибка при загрузке договоров:", error);
      }
    };

    fetchContracts();
  }, []);

  return <MenuForm contracts={contracts} />;
};

export default MenuPage;
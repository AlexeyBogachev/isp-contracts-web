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

        setContracts(response.data.slice(-15));
      } catch (error) {
        console.error("Ошибка при загрузке договоров:", error);
      }
    };

    fetchContracts();
  }, []);

  return <MenuForm contracts={contracts} />;
};

export default MenuPage;
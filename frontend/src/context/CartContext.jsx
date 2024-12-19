import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const {token} = useContext(AuthContext)
    const [cartItems, setCartItems] = useState([]);
    const [refresh, setRefresh] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get("http://192.168.1.47:3000/api/user/get-cart", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setCartItems(response.data.courses);
            } catch (error) {
              console.error("Lỗi khi lấy giỏ hàng:", error);
              Alert.alert("Lỗi", "Không thể tải giỏ hàng");
            }
          };
      
          fetchData(); 
    }, [refresh])
    
  return (
    <CartContext.Provider value={{ cartItems, setRefresh }}>
      {children}
    </CartContext.Provider>
  );
};

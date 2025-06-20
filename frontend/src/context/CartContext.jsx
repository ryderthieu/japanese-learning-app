import React, { createContext, useContext, useEffect, useState } from 'react';
import userService from '../api/userService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await userService.getCart();
              setCartItems(response.courses);
            } catch (error) {
              console.error("Lỗi khi lấy giỏ hàng:", error);
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

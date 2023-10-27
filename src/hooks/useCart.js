// Кастомный хук
import AppContext from '../context';
import React from 'react';


export const useCart = () => {
  const { cartItems, setCartItems } = React.useContext(AppContext);
  const totalPrice = cartItems.reduce((sum, obj) => obj.price + sum, 0);// создаем ф-ии в которой 0- это первое выводимое значени
  // с помощью метода reduce проходим по массиву cartItemImage в условии ф-ии складываем св-во объекта price с товарами добавленными в корзину


  return { cartItems, setCartItems, totalPrice };
};


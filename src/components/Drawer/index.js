import React from 'react';
import Info from '../Info';

import axios from 'axios';
import { useCart } from '../../hooks/useCart';

import styles from './Drawer.module.scss'


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ onClose, onRemove, items = [], opened }) {
  // с помощью деструктуризации {...} меняем props на onClose и items
  // items это props ф-ии юзСтэт получающец массив с бэкэнда начальное состояние пустой массив
  // корзина . Передаем onClose как props из App.js Drawer.js и передаем его
  // img в метод onClick
  const { cartItems, setCartItems, totalPrice } = useCart();
  const [orderId, setOrderId] = React.useState(null);
  const [isOrderCompleted, setIsOrderConpleted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        'https://6511d818b8c6ce52b3951bcf.mockapi.io/orders',
        { items: cartItems }
      );

      setOrderId(data.id);
      setIsOrderConpleted(true);
      setCartItems([]); // при нажатии на кнопку оформить заказ очищаем карзину на пустой массив через контекст

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete(
          'https://6504600bc8869921ae24f0f1.mockapi.io/cart' + item.id
        );
        await delay(1000);
      }
    } catch (error) {
      alert('Ошибка при создании заказа!  :(');
    }
    setIsLoading(false);
  };

  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : '' }`}>
      <div className={styles.drawer}>
        <h2 className="d-flex justify-between mb-30">
          Корзина {'  '}
          <img
            onClick={onClose}
            // onClose передан из Арр Drawer как props и из props Drawer.js в img в метод onClick={onClose}
            className="removeBtn cu-p"
            src="/img/btn-remove.svg"
            alt="Close"
          />
        </h2>

        {
          // рендерит либо пустую корзину либо список товаров добавленных в корзину
          items.length > 0 ? (
            <div className="d-flex flex-column flex">
              <div className="items flex">
                {items.map(
                  (
                    obj // получает масив с бэкенда и рендерит его в Drawer.js
                  ) => (
                    <div
                      key={obj.id}
                      className="cartItem d-flex align-center mb-20 "
                    >
                      {/* <div 
      // style={{ backgroundImage: `url(${obj.imageUrl})` }}
        className="cartItemImg" 

      ></div> */}
                      <div className="cartItemImg d-flex align-center mr-15">
                        <img
                          width={80}
                          height={60}
                          src={obj.imageUrl}
                          alt="Sneakers"
                        />
                      </div>
                      <div className="mr-20 flex">
                        <p className="mb-5">{obj.title}</p>
                        <b>{obj.price} руб.</b>
                      </div>
                      <img
                        onClick={() => onRemove(obj.id)}
                        className="removeBtn"
                        src="/img/btn-remove.svg"
                        // src="/img/btn-remove.svg"
                        alt="remove"
                      />
                    </div>
                  )
                )}
              </div>
              <div className="cartTotalBlock ">
                <ul>
                  <li>
                    <span>Итого:</span>
                    <div></div>
                    <b>{totalPrice} руб.</b>
                  </li>
                  <li>
                    <span>Налог 5%:</span>
                    <div></div>
                    <b>{(totalPrice / 100) * 5} руб.</b>
                  </li>
                </ul>
                <button
                  disabled={isLoading}
                  onClick={onClickOrder}
                  className="greenButton"
                >
                  Оформить заказ <img src="\img\arrow.svg" alt="arrow" />
                </button>
              </div>
            </div>
          ) : (
            <Info
              title={isOrderCompleted ? 'Заказ оформлен!' : 'Корзина пустая'}
              description={
                isOrderCompleted
                  ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
                  : 'Добавте хотя бы один товар, чтобы сделать заказ.'
              }
              image={
                isOrderCompleted
                  ? '/img/complete-order.jpg'
                  : '/img/empty-cart.jpg'
              }
            />
          )
        }
      </div>
    </div>
  );
}

export default Drawer;

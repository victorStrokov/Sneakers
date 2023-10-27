import React from 'react';
import { Link } from 'react-router-dom';

import { useCart } from '../hooks/useCart';

function Header(props) {
  // пропс это параметр онКликКарт Хедера из Арр.js

  const { totalPrice } = useCart(); // используем кастомный хук useCart для передачи ф-ии totalPrice в header

  return (
    <header className="d-flex justify-between align-center p-40">
      <Link to="/">
        <div className="d-flex align-center">
          <img
            className="mr-15"
            width={40}
            height={40}
            src="/img/logo.svg"
            alt="logo"
          />
          <div>
            <h3 className="text-uppercase">React Sneakers</h3>
            <p className="opacity-5">Магзин лучших кроссовок</p>
          </div>
        </div>
      </Link>{' '}
      {/**  Link позволяет переходить с страницы на страницу не перезагружая ее */}
      <ul className="d-flex">
        <li onClick={props.onClickCart} className="mr-30 cu-p">
          {/* он клик берет параметр пропс из Арр у Хедер онКликКарт куда передана 
          фуекция сетКартОпенед из функции юзСтэте */}
          <img
            className="mr-10"
            width={18}
            height={18}
            src="/img/cart.svg"
            alt="cart"
          />
          <span>{totalPrice} руб.</span>
          {/* передаем переменную totalPrice  */}
        </li>
       
        <li className="mr-20 cu-p">
          <Link to="/favorites">
            <img width={18} height={18} src="/img/heart.svg" alt="закладки" />
          </Link>
        </li>
        <li>
        <Link to="/orders">
            <img width={18} height={18} src="/img/user.svg" alt="user" />
          </Link>
        
        </li>
      </ul>
    </header>
  );
}

export default Header;

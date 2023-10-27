import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';
import Header from './components/Header';
import Drawer from './components/Drawer';
import axios from 'axios';
import AppContext from './context';

function App() {
  const [items, setItems] = React.useState([]); //  получает ответ с бэк энда и рендерит в приложение
  const [cartItems, setCartItems] = React.useState([]); // массив для хранения товаров в корзине он рендерится в компоненте Drawer
  const [favorites, setFavorites] = React.useState([]);
  const [cartOpened, setCartOpened] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true); // если приложениек впервые открылось isLoading true и идет получение новых данных

  React.useEffect(() => {
    // fetch('https://6504600bc8869921ae24f0f1.mockapi.io/items') // отправка запроса через фетч
    //   .then((res) => {
    //     // вытаскиваем данные с бекэнда res- response
    //     return res.json(); // ответ в json формате
    //   })
    //   .then((json) => {
    //     // возвращает массив  в json формате
    //     setItems(json); // передает массив  в переменную  setItems
    //   }); // пример fetch запроса на сервер .

    // создаем асинхронную ф-ию в стэйте
    async function fetchData() {
      // setIsLoading(true); // перед тем как отправить запросы выполни isLoading(true);

      try {
        const [cartResponse, favoritesResponse, itemsResponse] =
          await Promise.all([
            // Promise.all это промис который буде выполнять массив промисов
            axios.get('https://6504600bc8869921ae24f0f1.mockapi.io/cart'), // ждет выполнения всех промисов и результат выполнения вернет в виде массива cartResponse,favoritesResponse,itemsResponse]
            axios.get('https://6511d818b8c6ce52b3951bcf.mockapi.io/favorites'),
            axios.get('https://6504600bc8869921ae24f0f1.mockapi.io/items'),
          ]);
        // код ниже предназначен для того если нужно выполнить к примеру 1й промис а пока вывполняется последующий сделать чтото еще
        // const cartResponse = await axios.get(
        //   'https://6504600bc8869921ae24f0f1.mockapi.io/cart'
        // ); //отправка запроса на получение данных с бэкэнда в товаров находящихся в корзине
        // const favoritesResponse = await axios.get(
        //   'https://6511d818b8c6ce52b3951bcf.mockapi.io/favorites'
        // ); //отправка запроса на получение данных с бэкэнда в товаров находящихся в закладках
        // const itemsResponse = await axios.get(
        //   'https://6504600bc8869921ae24f0f1.mockapi.io/items'
        // ); // axios запрос на бэкэнд товара на главной странице

        setIsLoading(false); // после того как запросы выполнены и получены данные выполни isLoading(false)

        setCartItems(cartResponse.data); // сохраняем данные полученные с бэкэнда в переменные
        setFavorites(favoritesResponse.data); // сохраняем данные полученные с бэкэнда в переменные
        setItems(itemsResponse.data); // сохраняем данные полученные с бэкэнда в переменные
      } catch (error) {
        // если хоть один из промисов не выполнится
        alert('Ошибка при запросе данных ;('); // ошибка будет поймана
        console.error(error);
      }
    }
    fetchData(); // вызываем асинхронную ф-ию в стэйте
  }, []); // эта конструкция хукка юзЭффект говорит о том что нужно сделать только один
  // json запрос и больше не делать пока не будет что  то изменено //
  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find(
        (item) => Number(item.perentId) === Number(obj.id)
      );
      if (findItem) {
        //проверь есть ли такой item в корзине с таким жде id как у obj, ф-я Num() переводит id  с бэк энда и id наш в числовые зщначения
        setCartItems((prev) =>
          prev.filter((item) => Number(item.perentId) !== Number(obj.id))
        ); // если такой товар есть удали его из useState
        await axios.delete(
          `https://6504600bc8869921ae24f0f1.mockapi.io/cart/${findItem.id}`
        );
      } else {
        // если нет возьми его с бэлэнда
        //axios отправка данных на бэкэнд
        setCartItems((prev) => [...prev, obj]); // с помощью  спред оператора(...) заменяем данные в массиве
        const { data } = await axios.post(
          'https://6504600bc8869921ae24f0f1.mockapi.io/cart',
          obj
        );
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.perentId === data.perentId) {
              return {
                ...item,
                id: data.id,
              };
            }
            return item;
          })
        );
      }
    } catch (error) {
      alert('Ошибка при добавлении в корзину :(');
      console.error(error);
    }
  }; // prev это старые данные  данные к которым добовляются новые с помощью переменной obj

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://6504600bc8869921ae24f0f1.mockapi.io/cart/${id}`);
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(id))
      );
    } catch (error) {
      alert('Ошибка при удалении из карзины :(');
      console.error(error);
    }
  };

  const onAddToFavorite = async (obj) => {
    // метод добавления в бэкэнд закладок
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(
          `https://6511d818b8c6ce52b3951bcf.mockapi.io/favorites/${obj.id}`
        );
        setFavorites((prev) =>
          prev.filter((item) => Number(item.id) !== Number(obj.id))
        );
        // setFavorites((prev) => prev.filter((item) => item.id !== obj.id));
      } else {
        const { data } = await axios.post(
          'https://6511d818b8c6ce52b3951bcf.mockapi.io/favorites',
          obj
        );
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты!');
      console.error(error);
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    // isItemAdded ф-ия пробегается по массиву в корзине и уже в массиве карзины вытаскивать perentId
    // и сверять его с perentId который передается в карточке
    // ф-ия проверяет если хоть один id есть в cart выдавай true если нет false
    return cartItems.some((obj) => Number(obj.perentId) === Number(id));
  };

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFavorite,
        onAddToCart,
        setCartOpened,
        setCartItems,
      }}
    >
      {/* Оборачиваем все париложение в контекст и теперь  items,cartItems, favorites ,isItemAdded будут доступны в любом месте где есть эти компоненты  */}

      <div className="wrapper clear">
        <Drawer
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
          opened={cartOpened}
        />
        {/* onClose props Drawer его передаем в дравер , передаем из юзСтэйт items */}
        <Header onClickCart={() => setCartOpened(true)} />
        {/* onClickCart props Header его нужно передать в хедер */}

        {/* Контекст */}
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Home
                items={items}
                cartItems={cartItems}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToFavorite={onAddToFavorite}
                onAddToCart={onAddToCart}
                isLoading={isLoading}
              />
            }
          ></Route>
          <Route path="/favorites" exact element={<Favorites />}></Route>

          <Route path="/orders" exact element={<Orders />}></Route>
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;

import React from 'react';
import Card from '../components/Card';

function Home({
  items,

  searchValue,
  setSearchValue,
  onChangeSearchInput,
  onAddToFavorite,
  onAddToCart,
  isLoading,
}) {
  const renderItems = () => {
    // логика карьточек
    const filtredItems = items.filter(
      // создаю перемепнную и говорю если загрузка идет рендери потенциально фильтруемые объекты в этом массиве
      (item) => item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    return (isLoading ? [...Array(12)] : filtredItems).map(
      //если идет загрузка рендери 12 шт. или же верни то что вернул бэкэнд
      (
        // но в любом слоучае если 12 undefinde или реальные данные рендери карточки
        item,
        index //items из useState рендерится в карточки кроссовок
      ) => (
        <Card
          key={index}
          onFavorite={(obj) => onAddToFavorite(obj)}
          onPlus={(obj) => onAddToCart(obj)} // получает объект из ф-ии onClickPlus который содержит массив с бэкенда , можно передать item и будет работать так же
          loading={isLoading}
          {...item}
        />
      )
    );
  };

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>
          {searchValue ? `Поиск по запросу: "${searchValue}"` : 'Все кроссовки'}
        </h1>
        <div className="search-block d-flex">
          <img src="/img/search.svg" alt="search" />
          {searchValue && (
            <img
              onClick={() => setSearchValue('')}
              className="clear cu-p"
              src="/img/btn-remove.svg"
              alt="Clear"
            />
          )}
          <input
            onChange={onChangeSearchInput}
            value={searchValue}
            placeholder="Поиск... "
          />
        </div>
      </div>
      <div className="d-flex flex-wrap">
        {/* карточки  */}
        {renderItems()}
      </div>
    </div>
  );
}

export default Home;

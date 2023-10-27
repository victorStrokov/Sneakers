import React from 'react';
import styles from './Card.module.scss';
import ContentLoader from 'react-content-loader';
import AppContext from '../../context'; // вытыщи мне из файла context данные AppContext
function Card({
  id,

  title,
  imageUrl,
  price,
  onFavorite,
  onPlus,
  favorited = false,

  loading = false,
}) {
  // с помощью деструктуризации получаем нужный массив
  const { isItemAdded } = React.useContext(AppContext); // теперь из AppContext вытаскиваем ф-ю isItemAdded
  const [isFavorite, setIsFavorite] = React.useState(favorited); // сохранение закладок
  const Obj = { id, perentId: id, title, imageUrl, price };

  const onClickPlus = () => {
    onPlus(Obj); // передаем в ф-ию метод onPlus , а в него объект полученный с бэкенда
  };
  const onClickFavorite = () => {
    // ф-ия передающая закладки на бэкенд
    onFavorite(Obj);
    setIsFavorite(!isFavorite);
  };
  return (
    <div className={styles.card}>
      {/* styles.card вытыскивает стили из card.module с именем .card */}
      {loading ? (
        <ContentLoader
          speed={2}
          width={150}
          height={187}
          viewBox="0 0 150 187"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="10" ry="10" width="150" height="90" />
          <rect x="0" y="96" rx="5" ry="5" width="150" height="15" />
          <rect x="0" y="118" rx="5" ry="5" width="100" height="15" />
          <rect x="0" y="162" rx="5" ry="5" width="80" height="24" />
          <rect x="117" y="154" rx="10" ry="10" width="32" height="32" />
        </ContentLoader>
      ) : (
        <>
          {/* <></> это называетсчя фрагмент он будет как родительский блок в реак */}
          {onFavorite && (
            <div className={styles.favorite} onClick={onClickFavorite}>
              {/* styles.favorite извлекает стили из card.module с именем favorete */}
              <img
                src={isFavorite ? '/img/liked.svg' : '/img/unliked.svg'}
                alt="liked"
              />
            </div>
          )}
          <img width={130} height={112} src={imageUrl} alt="Sneakers" />
          <h5>{title}</h5>
          <div className="d-flex justify-between align-center">
            <div className="d-flex flex-column">
              <p>Цена:</p>
              <b>{price} руб.</b>
            </div>

            {onPlus && (
              <img // если есть ф-ия onPlus то отображаем кнопку плюс если нет то не отображать
                className={styles.plus}
                onClick={onClickPlus}
                src={
                  isItemAdded(id) ? '/img/btn-checked.svg' : '/img/btn-plus.svg'
                } // тут каждый раз чекни если этот id есть в cart то тогда true ЕСЛИ НЕТ false
                alt="Plus"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Card;

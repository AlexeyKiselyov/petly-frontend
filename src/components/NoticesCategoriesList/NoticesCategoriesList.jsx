import { NoticeCategoryItem } from '../../components/NoticeCategoryItem/NoticeCategoryItem';
import { ScrollUpBtn } from '../CommonButtons/ScrollUpBtn/ScrollUpBtn';
import { List } from './NoticesCategoriesList.styled';

export const NoticesCategoriesList = ({
  data,
  route,
  reference,
  deleteNotice,
  updateFavorite,
}) => {
  return (
    <>
      <List>
        {data.map((item, idx) => {
          if (data.length === idx + 1) {
            return (
              <NoticeCategoryItem
                key={item._id}
                data={item}
                route={route}
                reference={reference}
                deleteNotice={deleteNotice}
                updateFavorite={updateFavorite}
              />
            );
          } else {
            return (
              <NoticeCategoryItem
                key={item._id}
                data={item}
                route={route}
                reference={null}
                deleteNotice={deleteNotice}
                updateFavorite={updateFavorite}
              />
            );
          }
        })}
      </List>

      <ScrollUpBtn />
    </>
  );
};

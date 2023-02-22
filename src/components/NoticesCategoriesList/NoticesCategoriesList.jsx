import { NoticeCategoryItem } from '../../components/NoticeCategoryItem/NoticeCategoryItem';
import { ScrollUpBtn } from '../CommonButtons/ScrollUpBtn/ScrollUpBtn';
import { List } from './NoticesCategoriesList.styled';

export const NoticesCategoriesList = ({ data, route, reference }) => {
  return (
    <>
      <List>
        {data
          .filter(
            item =>
              item.category === route ||
              route === 'owner' ||
              route === 'favorite'
          )
          .map((item, idx) => {
            if (data.length === idx + 1) {
              return (
                <NoticeCategoryItem
                  key={item._id}
                  data={item}
                  route={route}
                  reference={reference}
                />
              );
            } else {
              return (
                <NoticeCategoryItem
                  key={item._id}
                  data={item}
                  route={route}
                  lastBookElementRef={null}
                />
              );
            }
          })}
      </List>     

      <ScrollUpBtn />
    </>
  );
};

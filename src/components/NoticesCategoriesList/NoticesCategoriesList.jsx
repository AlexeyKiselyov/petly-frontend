import { NoticeCategoryItem } from '../../components/NoticeCategoryItem/NoticeCategoryItem';
import { ScrollUpBtn } from '../CommonButtons/ScrollUpBtn/ScrollUpBtn';
import { List } from './NoticesCategoriesList.styled';

export const NoticesCategoriesList = ({ data, route, lastBookElementRef }) => {
  return (
    <>
      <List>
        {[...data]
          .reverse()
          .filter(
            item =>
              item.category === route ||
              route === 'owner' ||
              route === 'favorite'
          )
          .map((item, idx) => {
            if (data.length === idx) {
              return (
                <NoticeCategoryItem
                  key={item._id}
                  data={item}
                  route={route}
                  lastBookElementRef={lastBookElementRef}
                />
              );
            } else {
              return (
                <NoticeCategoryItem
                  key={item._id}
                  data={item}
                  route={route}
                  lastBookElementRef={lastBookElementRef}
                />
              );
            }
          })}
      </List>
      <ScrollUpBtn />
    </>
  );
};

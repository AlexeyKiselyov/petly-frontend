import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';

import {
  selectUser,
  selectIsAuth,
  selectFavoriteNotices,
} from '../../redux/auth/authSelectors';
import { updateFavoriteNotice } from '../../redux/auth/authOperations';

import { FavoriteBtn } from '../CommonButtons/FavoriteBtn/FavoriteBtn';
import { LearnMoreBtn } from '../CommonButtons/LearnMoreBtn/LearnMoreBtn';
import { DeletePetNoticesBtn } from '../CommonButtons/DeletePetNoticesBtn/DeletePetNoticesBtn';
import { ModalNotice } from './ModalNotice/ModalNotice';
import { WarningMessage } from '../../components/CommonComponents/WarningMessage/WarningMessage';
import { Loader } from '../Loader/Loader';

import {
  Item,
  Wrap,
  ImgWrap,
  CategoryLabel,
  Img,
  WrapInner,
  Title,
  Ul,
  Li,
  Lable,
  Text,
  ThumbBtn,
} from './NoticeCategoryItem.styled';

import { getAge } from '../../helpers/dateFormat';
import {
  MUST_AUTHORIZED_TO_FAVORITES,
  CONFIRMATION_DELETE,
  CATEGORIES_NOTICES,
} from '../../helpers/constants';

// =========================================================
export const NoticeCategoryItem = ({
  data,
  reference,
  deleteNotice,
  updateFavorite,
}) => {
  const {
    _id,
    title,
    category,
    name,
    birthdate,
    breed,
    location,
    imgURL,
    owner,
  } = data;

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [oneNotice, setOneNotice] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShownAlert, setIsShownAlert] = useState(false);
  const [isShownConfirmationDelete, setIsShownConfirmationDelete] =
    useState(false);

  const currentUser = useSelector(selectUser);
  const isAuth = useSelector(selectIsAuth);
  const favorites = useSelector(selectFavoriteNotices);

  const isFavorite = favorites.includes(_id);

  const onChangeFavorite = () => {
    if (isAuth) {
      updateFavorite(_id);
      dispatch(updateFavoriteNotice({ noticeId: _id }));
    } else {
      setIsShownAlert(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  
  const openModal = () => {
    setIsLoading(true);
    axios(`/notices/notice/${_id}`)
      .then(result => {
        setOneNotice(result.data);
      })
      .catch(error => setError(error.message))
      .finally(() => {
        setIsLoading(false);
      });

    setIsModalOpen(true);
  };

  const closeAlert = () => {
    setIsShownAlert(!isShownAlert);
  };

  const closeConfirmationDelete = () => {
    setIsShownConfirmationDelete(!isShownConfirmationDelete);
  };

  const age = getAge(birthdate);

  return (
    <>
      {reference ? (
        <Item ref={reference}>
          <ImgWrap>
            <CategoryLabel>{CATEGORIES_NOTICES[category]}</CategoryLabel>
            <Img src={imgURL} alt={name} loading="lazy" />
            <FavoriteBtn favorite={isFavorite} onClick={onChangeFavorite} />
          </ImgWrap>
          <Wrap>
            <WrapInner>
              <Title>{title}</Title>
              <Ul>
                <Li key={`${_id}+breed`}>
                  <Lable>Breed:</Lable>
                  <Text>{breed}</Text>
                </Li>
                <Li key={`${_id}+place`}>
                  <Lable>Place:</Lable>
                  <Text>{location}</Text>
                </Li>
                <Li key={`${_id}+age`}>
                  <Lable>Age:</Lable>
                  <Text>{age}</Text>
                </Li>
              </Ul>
            </WrapInner>
            <ThumbBtn>
              <LearnMoreBtn onClick={openModal} />
              {currentUser.email === owner.email && (
                <DeletePetNoticesBtn onClick={closeConfirmationDelete} />
              )}
            </ThumbBtn>
          </Wrap>
        </Item>
      ) : (
        <Item>
          <ImgWrap>
            <CategoryLabel>{CATEGORIES_NOTICES[category]}</CategoryLabel>
            <Img src={imgURL} alt={name} loading="lazy" />
            <FavoriteBtn favorite={isFavorite} onClick={onChangeFavorite} />
          </ImgWrap>
          <Wrap>
            <WrapInner>
              <Title>{title}</Title>
              <Ul>
                <Li key={`${_id}+breed`}>
                  <Lable>Breed:</Lable>
                  <Text>{breed}</Text>
                </Li>
                <Li key={`${_id}+place`}>
                  <Lable>Place:</Lable>
                  <Text>{location}</Text>
                </Li>
                <Li key={`${_id}+age`}>
                  <Lable>Age:</Lable>
                  <Text>{age}</Text>
                </Li>
              </Ul>
            </WrapInner>
            <ThumbBtn>
              <LearnMoreBtn onClick={openModal} />
              {currentUser.email === owner.email && (
                <DeletePetNoticesBtn onClick={closeConfirmationDelete} />
              )}
            </ThumbBtn>
          </Wrap>
        </Item>
      )}
      {isModalOpen && !isLoading && (
        <ModalNotice
          onClose={closeModal}
          data={oneNotice}
          isFavorite={isFavorite}
          onClickFavorite={onChangeFavorite}
        />
      )}
      {isShownAlert && !isAuth && (
        <WarningMessage
          onClose={closeAlert}
          type="auth"
          title="Unauthorized"
          text={MUST_AUTHORIZED_TO_FAVORITES}
        />
      )}
      {isShownConfirmationDelete && (
        <WarningMessage
          onClose={closeConfirmationDelete}
          type="approve"
          text={CONFIRMATION_DELETE}
          id={_id}
          deleteNotice={deleteNotice}
        />
      )}
      {isLoading && <Loader />}
    </>
  );
};

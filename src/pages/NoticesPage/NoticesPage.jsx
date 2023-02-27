import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { selectIsAuth } from '../../redux/auth/authSelectors';

import { SectionTitle } from '../../components/CommonComponents/SectionTitle/SectionTitle';
import { Section } from '../../components/CommonComponents/Section/Section';
import { WarningMessage } from '../../components/CommonComponents/WarningMessage/WarningMessage';
import { Container } from '../../components/CommonComponents/Container/Container';
import { AddNoticeButton } from '../../components/CommonButtons/AddNoticeButton/AddNoticeButton';

import { NoticesCategoriesNav } from '../../components/NoticesCategoriesNav/NoticesCategoriesNav';
import { NoticesCategoriesList } from '../../components/NoticesCategoriesList/NoticesCategoriesList';
import { ModalAddNotice } from '../../components/ModalAddNotice/ModalAddNotice';
import { NoticesSearch } from '../../components/NoticesSearch/NoticesSearch';
import { Notification } from '../../components/Notification/Notification';
import { Loader } from '../../components/Loader/Loader';

import { NOT_FOUND } from '../../helpers/constants';

import { MenuWrap } from './NoticesPage.styled';

import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import { deleteNotice, postNotice } from '../../serveсes/fetchNotices';

// ================================================================
const NoticesPage = () => {
  const { route } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTitleQwery, setSearchTitleQwery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuth = useSelector(selectIsAuth);

  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    setError(false);
    setNotices([]);
    setPageNumber(1);
  }, [route, searchTitleQwery]);

  useEffect(() => {
    setError(false);
    setIsLoading(true);
    axios(
      `/notices/${route}?page=${pageNumber}&limit=${8}&qwery=${searchTitleQwery}`
    )
      .then(res => {
        setNotices(prev => {
          return [...prev, ...res.data.notices];
        });
      })
      .catch(error => setError(error.message))
      .finally(() => {
        setIsLoading(false);
      });
  }, [route, searchTitleQwery, pageNumber]);

  useEffect(() => {
    if (!inView) return;
    setPageNumber(prevPageNumber => prevPageNumber + 1);
  }, [inView]);

  const closeModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onSearch = searchQuery => {
    setSearchTitleQwery(searchQuery);
  };

  const onAddNotice = data => {
    postNotice(data, route, setError, setIsLoading, setNotices);
  };

  const onDeleteNotice = id => {
    deleteNotice(id, notices, setError, setIsLoading, setNotices);
  };

  const updateFavorite = _id => {
    if (route !== 'favorite') return;
    const newFavoriteNotices = notices.filter(notice => notice._id !== _id);
    setNotices(newFavoriteNotices);
  };

  return (
    <Section>
      <Container>
        <SectionTitle text={'Find your favorite pet'} />
        <NoticesSearch onSearch={onSearch} />
        <>
          <MenuWrap>
            <NoticesCategoriesNav />
            <AddNoticeButton onClick={closeModal} />
          </MenuWrap>
          {notices?.length > 0 ? (
            <NoticesCategoriesList
              data={notices}
              reference={ref}
              deleteNotice={onDeleteNotice}
              updateFavorite={updateFavorite}
            />
          ) : (
            !isLoading && <Notification message={NOT_FOUND} />
          )}
        </>
        {isModalOpen && isAuth && (
          <ModalAddNotice onClose={closeModal} addNotice={onAddNotice} />
        )}
        {isModalOpen && !isAuth && (
          <WarningMessage
            onClose={closeModal}
            type="auth"
            title="Unauthorized"
            text="Let`s login or registration to add notice."
          />
        )}
        {isLoading && <Loader />}
      </Container>
    </Section>
  );
};

export default NoticesPage;

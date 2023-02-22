import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  selectNotices,
  selectNoticesIsLoading,
} from '../../redux/notices/noticesSelectors';
import { fetchNotices } from '../../redux/notices/noticesOperations';
import { clearNotices } from '../../redux/notices/noticesSlice';
import { selectIsAuth } from '../../redux/auth/authSelectors';

import { SectionTitle } from '../../components/CommonComponents/SectionTitle/SectionTitle';
import { NoticesCategoriesNav } from '../../components/NoticesCategoriesNav/NoticesCategoriesNav';
import { Section } from '../../components/CommonComponents/Section/Section';
import { Container } from '../../components/CommonComponents/Container/Container';
import { AddNoticeButton } from '../../components/CommonButtons/AddNoticeButton/AddNoticeButton';
import { NoticesCategoriesList } from '../../components/NoticesCategoriesList/NoticesCategoriesList';
import { ModalAddNotice } from '../../components/ModalAddNotice/ModalAddNotice';
import { NoticesSearch } from '../../components/NoticesSearch/NoticesSearch';
import { Notification } from '../../components/Notification/Notification';
import { Loader } from '../../components/Loader/Loader';
import { WarningMessage } from '../../components/CommonComponents/WarningMessage/WarningMessage';

import { NOT_FOUND } from '../../helpers/constants';

import { MenuWrap } from './NoticesPage.styled';
import axios from 'axios';
import { useRef } from 'react';
import { useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

// ================================================================
const NoticesPage = () => {
  const { route } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTitleQwery, setSearchTitleQwery] = useState('');
  const [hasMore, setHasMore] = useState(false);
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
    console.log('use eff');
    setNotices([]);
    setPageNumber(1);
    setHasMore(false);
  }, [route, searchTitleQwery]);

  useEffect(() => {
    setError(false);
    if (searchTitleQwery !== '') {
      axios(
        `/notices/${route}?page=${pageNumber}&limit=${8}&qwery=${searchTitleQwery}`
      )
        .then(res => {
          setNotices(prev => [...prev, ...res.data.notices]);
        })
        .catch(err => setError(err.message))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(true);
      axios(`/notices/${route}?page=${pageNumber}&limit=${8}`)
        .then(res => {
          setNotices(prev => {
            return [...prev, ...res.data.notices];
          });
          setHasMore(res.data.notices.length > 0);
        })
        .catch(err => setError(err.message))
        .finally(() => {
          setIsLoading(false);
        });
    }
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
              route={route}
              data={notices}
              reference={ref}
              hasMore={hasMore}
            />
          ) : (
            !isLoading && <Notification message={NOT_FOUND} />
          )}
          {!hasMore && <p>No more data...</p>}
        </>
        {isModalOpen && isAuth && <ModalAddNotice onClose={closeModal} />}
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

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

// ================================================================
const NoticesPage = () => {
  const { route } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTitleQwery, setSearchTitleQwery] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // const notices = useSelector(selectNotices);
  // const isLoading = useSelector(selectNoticesIsLoading);
  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    console.log("use eff");
    setNotices([]);
    setPageNumber(1);
    setHasMore(false);
  }, [route, searchTitleQwery]);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    if (searchTitleQwery !== '') {
      // dispatch(fetchNotices({ category: route, qwery: searchTitleQwery }));
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
            console.log(prev);
            console.log(res.data);

            return [...prev, ...res.data.notices];
          });
          setHasMore(res.data.notices.length > 0);
          setIsLoading(false);
          console.log(notices);
        })
        .catch(err => setError(err.message))
        // .finally(() => {
        // });
    }
    // return () => setNotices([]);
  }, [route, searchTitleQwery, pageNumber]);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    node => {
      // console.log(node);
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber(prevPageNumber => prevPageNumber + 1);
          console.log('Page+1');
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

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
              lastBookElementRef={lastBookElementRef}
            />
          ) : (
            !isLoading && <Notification message={NOT_FOUND} />
          )}
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

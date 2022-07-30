import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import axios from '../axios';
import ReactMarkdown from 'react-markdown';
import { fetchComments } from '../redux/slices/posts';
import { selectIsAuth } from '../redux/slices/auth';

export const FullPost = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const [data, setData] = React.useState();
  const { comments } = useSelector((state) => state.post);
  const [isLoading, setIsLoading] = React.useState(true);
  const { id } = useParams();
  const isCommentsLoading = comments.status === 'loading';

  React.useEffect(() => {
    setIsLoading(true);

    axios
      .get(`/posts/${id}`)
      .then((res) => {
        dispatch(fetchComments());
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении статьи');
      });
  }, []);

  if (isLoading) {
    return (
      <>
        <Post isLoading={isLoading} isFullPost />
        <CommentsBlock isLoading={isLoading} />
      </>
    );
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost>
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock items={comments.items} isLoading={isCommentsLoading}>
        {isAuth && <Index items={data.user} isLoading={isCommentsLoading} />}
      </CommentsBlock>
    </>
  );
};

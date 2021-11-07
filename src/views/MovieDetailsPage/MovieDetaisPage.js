import { useState, useEffect, lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Switch,
  useLocation,
  useHistory,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import Loader from 'react-loader-spinner';
import s from './MovieDetailsPage.module.css';
import { fetchMovieById } from '../../services/fetchMovies';
const Casts = lazy(() =>
  import('../../components/Casts' /* webpackChunkName: 'Casts' */),
);
const Reviews = lazy(() =>
  import('../../components/Reviews' /* webpackChunkName: 'Reviews' */),
);

function MovieDetailsPage() {
  const [film, setFilm] = useState({});
  const [state, setState] = useState('init');
  const location = useLocation();
  const history = useHistory();
  const params = useParams();
  const { path, url } = useRouteMatch();

  useEffect(() => {
    setState('pending');
    fetchMovieById(params.moviesId)
      .then(data => {
        setFilm(data);
        setState('resolved');
      })
      .catch(err => {
        setState('rejected');
      });
  }, [params.moviesId]);

  const handleClick = () => {
    history.push(location?.state?.from?.location?.pathname ?? '/');
  };

  if (state === 'init') {
    return <div></div>;
  }

  if (state === 'pending') {
    return (
      <div className="Loader">
        <Loader type="Grid" color="#8d6675" height={200} width={200} />
      </div>
    );
  }

  if (state === 'rejected') {
    return (
      <p>
        <b>Opps... something went wrong, nothing was found!</b>
      </p>
    );
  }

  if (state === 'resolved') {
    return (
      <div className={s.MovieDetailsPage}>
        <button className={s.goBack} type="button" onClick={handleClick}>
          Go back
        </button>
        <div className={s.movieInfo}>
          <div className={s.image}>
            <img
              class={s.img}
              src={
                film.poster_path
                  ? `https://image.tmdb.org/t/p/w500//${film.poster_path}`
                  : 'https://dummyimage.com/200x250/2a2a2a/ffffff&text=Movie+image+placeholder'
              }
              alt={film.tagline}
            />
          </div>
          <div>
            {<h2>{film.title}</h2> || <h2>{film.name}</h2>}
            <p>Duration: {film.runtime} minutes</p>
            <p>Date of relise: {film.release_date}</p>
          </div>
        </div>
        {/* <Router> */}
        <ul className={s.list}>
          <li>
            <NavLink
              exact
              className={s.link}
              activeClassName={s.activeLink}
              to={`${url}/casts`}
            >
              Casts
            </NavLink>
          </li>
          <li>
            <NavLink
              exact
              className={s.link}
              activeClassName={s.activeLink}
              to={`${url}/reviews`}
            >
              Reviews
            </NavLink>
          </li>
        </ul>
        <Suspense
          fallback={
            <div className="Loader">
              <Loader type="Grid" color="#8d6675" height={200} width={200} />
            </div>
          }
        >
          <Switch>
            <Route exact path={`${path}/casts`}>
              <Casts id={params.moviesId} />
            </Route>
            <Route exact path={`${path}/reviews`}>
              <Reviews id={params.moviesId} />
            </Route>
          </Switch>
        </Suspense>
        {/* </Router> */}
      </div>
    );
  }
}

export default MovieDetailsPage;

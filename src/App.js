import { lazy, Suspense, useEffect } from 'react';
import { NavLink, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Loader from 'react-loader-spinner';
const HomePage = lazy(() =>
  import('./views/HomePage' /* webpackChunkName: 'Home Page'*/),
);
const MoviesPage = lazy(() =>
  import('./views/MoviesPage' /* webpackChunkName: 'Movies Page'*/),
);
const MovieDetailsPage = lazy(() =>
  import('./views/MovieDetailsPage' /* webpackChunkName: 'Details Page'*/),
);

function App() {
  useEffect(() => {
    return localStorage.setItem('searchMoviesList', '');
  }, []);

  return (
    <div>
      <nav>
        <ul className="NavList">
          <li>
            <NavLink
              className="NavLink"
              activeClassName="activeNavLink"
              exact
              to="/"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              className="NavLink"
              activeClassName="activeNavLink"
              exact
              to="/movies"
            >
              Movies
            </NavLink>
          </li>
        </ul>
      </nav>
      <Suspense
        fallback={
          <div className="Loader">
            <Loader type="Grid" color="#8d6675" height={200} width={200} />
          </div>
        }
      >
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/movies" exact component={MoviesPage} />
          <Route path="/movies/:id" component={MovieDetailsPage} />
          <Route>
            <Redirect exact to="/" />
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;

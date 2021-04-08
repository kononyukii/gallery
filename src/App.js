import Header from "./components/Header";
import Registration from "./components/Registration";
import Login from "./components/Login";

import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import AlbumPhoto from "./components/Gallery/NewAlbum/AlbumPhoto";
import Warning from "./components/Warning";
import AuthGallery from "./components/Gallery";
import { ProvideAuth, useAuth } from "./hooks/auth";

//Fixed login, using hook useAuth
export function App() {
  const { userPhoto, error, userId } = useSelector((store) => store);

  return (
    <div className="app">
      <Header photos={userPhoto.userPhotos} id={userId} />
      <Warning message={error} />
      <ProvideAuth>
        <Switch>
          <Route path="/registration">
            <Registration />
          </Route>
          <Route path="/login" >
            <Login />
          </Route>
          <PrivateRoute exact path="/">
            <AuthGallery
              photos={userPhoto.userPhotos}
              album={userPhoto.userAlbum}
              userId={userId}
            />
          </PrivateRoute>
          <PrivateRoute path="/album/:id">
            <AlbumPhoto album={userPhoto.userAlbum} />
          </PrivateRoute>
        </Switch>
      </ProvideAuth>
    </div>
  );
}

function PrivateRoute({ children, ...rest }) {
  const auth = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: location } }} />
        )
      }
    />
  );
}

export default App;
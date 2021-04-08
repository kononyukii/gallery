import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { addAllPhoto, addUserId, errorServ } from "../../redusers";
import styled from "styled-components";
import { useAuth } from "../../hooks/auth";

const Login = () => {
  const [messageWarn, setMessageWarn] = useState("");

  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: "/" } };

  let login = () => {
    auth.signin(() => {
      history.replace(from);
    });
  };

  const dispatch = useDispatch();

  const loginUser = useCallback(async (e) => {
    e.preventDefault();

    try {
      let response = await fetch("/login", {
        method: "POST",
        body: new FormData(e.target),
      });

      let result = await response.json();
      
      if (response.status < 300) {
        dispatch(addAllPhoto(result.data.userGallery));
        dispatch(addUserId(result.data.id));
        setMessageWarn("");
        login()
      } else {
        setMessageWarn(result.message);
      }
    } catch (err) {
      dispatch(errorServ("" + err));
    }
  }, []);

  return (
    <form className="container p-5 col-4" onSubmit={loginUser}>
      <div className="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter email"
          name="email"
        />
      </div>
      <div className="form-group">
        <label for="exampleInputPassword1">Пароль</label>
        <input
          type="password"
          className="form-control"
          id="exampleInputPassword1"
          placeholder="Password"
          name="password"
        />
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <button type="submit" className="btn btn-primary">
          Войти
        </button>
        <span>или</span>
        <Link to="/registration">Зарегистрироваться</Link>
      </div>
      {messageWarn.length > 0 && (
        <Warn>
          <br />
          {messageWarn}
        </Warn>
      )}
    </form>
  );
};

export default Login;

let Warn = styled.small`
  color: red;
`;

import { useDispatch } from "react-redux";
import { addUserId, errorServ } from "../../redusers";
import styled from "styled-components";
import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/auth";

const Registration = () => {
  const dispatch = useDispatch();
  let auth = useAuth();
  let history = useHistory();

  const [messageWarn, setMessageWarn] = useState("");

  const { register, errors, handleSubmit } = useForm();

  const validators = {
    required: "Не может быть пустым",
  };

  const addNewUser = useCallback(async (values) => {
    try {
      let response = await fetch("/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      let result = await response.json();

      if (response.status < 300) {
        dispatch(addUserId(result.id));
        setMessageWarn("");
        auth.signin(() => {
          history.replace("/");
        });
      } else {
        setMessageWarn(result.message);
      }
    } catch (err) {
      dispatch(errorServ("" + err));
    }
  }, []);

  return (
    <div>
      <form
        className="container p-5 col-4"
        action="/"
        onSubmit={handleSubmit(addNewUser)}
      >
        <div className="form-group">
          <label for="exampleInputName1">Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Имя"
            id="exampleInputName1"
            name="name"
            ref={register({
              ...validators,
              minLength: {
                value: 2,
                message: "Не менее двух букв",
              },
              maxLength: {
                value: 10,
                message: "Не более десяти букв",
              },
              pattern: {
                value: /[А-ЯЁІЇҐЄ\w-]{2,10}/i,
                message:
                  "Только буквенный или цифровой символ, знак подчёркивания и дефис",
              },
            })}
          />
          <Err>{errors.name && errors.name.message}</Err>
        </div>
        <div className="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Email"
            name="email"
            ref={register({
              ...validators,
              pattern: {
                value: /^[a-zA-Z0-9-]+[a-zA-Z0-9-\.]*[a-zA-Z0-9-]+@[a-zA-Z0-9-]+[a-zA-Z0-9-\.]*\.[a-zA-Z0-9-]{2,}$/i,
                message: "Неправильный адрес электронной почты",
              },
            })}
          />
          <small id="emailHelp" className="form-text text-muted">
            Мы никому не передадим вашу электронную почту.
          </small>
          <Err>{errors.email && errors.email.message}</Err>
        </div>
        <div className="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Пароль"
            name="password"
            ref={register({
              ...validators,
              pattern: {
                value: /^[A-Z0-9_-]{4,12}$/i,
                message:
                  "От 4 до 12 символов: латиница, цифры, нижнее подчеркивание и дефис",
              },
            })}
          />
          <Err>{errors.password && errors.password.message}</Err>
        </div>
        <input type="submit" className="btn btn-primary" value="Добавить" />
        {messageWarn.length > 0 && (
          <Warn>
            <br />
            {messageWarn}
          </Warn>
        )}
      </form>
    </div>
  );
};

export default Registration;

let Warn = styled.small`
  color: red;
`;
let Err = styled.small`
  color: orange;
`;

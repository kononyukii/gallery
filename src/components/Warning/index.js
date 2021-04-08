import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { errorServ } from "../../redusers";

//Yes, work with errors can be done better, here I frankly did not have time
const Warning = (props) => {
  let { message } = props;
  const dispatch = useDispatch();

  const removeWarning = useCallback((e) => {
    e.preventDefault();
    dispatch(errorServ(""));
  }, []);

  return (
    <>
      {message.length > 0 && (
        <div className="error">
          <span></span>
          <span>Error: {message}{" "}</span>
          <a type="button" onClick={removeWarning}>
            &times;
          </a>
        </div>
      )}
    </>
  );
};

export default Warning;

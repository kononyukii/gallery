import { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { addPhoto, errorServ } from "../../../redusers";

const LoadingPhotos = (props) => {
  const { id } = props;
  const dispatch = useDispatch();

  const addNewPhoto = useCallback(async (e) => {
    e.preventDefault();

    try {
      let response = await fetch(`/upload/${id}`, {
        method: "POST",
        body: new FormData(e.target),
      });

      let result = await response.json();

      if (response.status < 300) {
        dispatch(addPhoto(result));

        fileRef.current.value = null;
      } else {
        dispatch(errorServ(result.message));
      }
    } catch (err) {
      dispatch(errorServ("" + err));
    }
  }, []);

  const fileRef = useRef(null);

  return (
    <form
      action="/upload"
      method="post"
      enctype="multipart/form-data"
      id="formElem"
      onSubmit={addNewPhoto}
    >
      <div className="form-group">
        <label for="exampleFormControlFile1">
          <b>Добавить фото</b>
        </label>
        <input
          type="file"
          ref={fileRef}
          className="form-control-file"
          id="exampleFormControlFile1"
          name="filedata"
        />
        <input type="submit" value="Send" class="btn btn-outline-secondary" />
      </div>
    </form>
  );
};

export default LoadingPhotos;

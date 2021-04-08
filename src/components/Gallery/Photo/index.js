import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { checkPhotoServ, removePhotoServ } from "../../../redusers";

const Photo = (props) => {
  const { photo, userId } = props;
  const dispatch = useDispatch();

  const onRemove = useCallback((e) => {
    e.preventDefault();
    dispatch(removePhotoServ(photo.path, userId));
  }, []);

  const onCheck = useCallback((e) => {
    if (e.target.checked) {
      dispatch(checkPhotoServ(photo.path, userId));
    } else if (!e.target.checked) {
      dispatch(checkPhotoServ(photo.path, userId));
    }
  }, []);

  let size = (photo.size / 1000).toFixed(1);
  return (
    <div className="card">
      <input type="checkbox" defaultChecked={photo.check} onChange={onCheck} />
      <img src={photo.filename} alt="." />
      <div>
        <span>{photo.date}</span>
        <br />
        <span>{size + "kb"}</span>
      </div>
      <a className="delete" href="#" onClick={onRemove}>
        &#10008;
      </a>
    </div>
  );
};

export default Photo;

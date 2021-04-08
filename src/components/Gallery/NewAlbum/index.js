import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import {
  removeAlbumFromPhotoServ,
  removeAlbumWithoutPhotoServ,
} from "../../../redusers";
import store from "../../../store";

const NewAlbum = (props) => {
  const { album, userId } = props;

  const [removeAlbum, setRemoveAlbum] = useState(false);

  const deleteAlbum = useCallback(
    (e) => {
      e.preventDefault();
      setRemoveAlbum(!removeAlbum);
    },
    [removeAlbum]
  );

  const removePhotos = useCallback(
    () => {
      store.dispatch(removeAlbumFromPhotoServ(userId, album.names));
    },
    [removeAlbum]
  );

  const movePhotos = useCallback(
    () => {
      store.dispatch(removeAlbumWithoutPhotoServ(userId, album.names));
    },
    [removeAlbum]
  );

  return (
    <div className="album card">
      <svg
        width="3em"
        height="3em"
        viewBox="0 0 16 16"
        class="bi bi-folder-fill"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"
        />
      </svg>
      <Link to={`/album/${album.id}`} className="album-name">
        {album.names}
      </Link>
      <span className="number-of-photos">{`(${album.photos.albumPhotos.length} photos)`}</span>
      <a className="delete" href="#" onClick={deleteAlbum}>
        &#10008;
      </a>
      {removeAlbum && (
        <div className="remove-album">
          <span className="ml-1 mr-1">
            Желаете удалить фотографии вместе с альбомом или переместить в общий
            список?
          </span>
          <button className="mr-1 btn btn-danger btn-sm" onClick={removePhotos}>
            Удалить
          </button>
          <button className="btn btn-success btn-sm" onClick={movePhotos}>
            Переместить
          </button>
        </div>
      )}
    </div>
  );
};

export default NewAlbum;

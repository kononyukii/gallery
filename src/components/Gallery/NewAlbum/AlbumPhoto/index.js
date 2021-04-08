import { useCallback, useState } from "react";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import useEventListener from "@use-it/event-listener";

const AlbumPhoto = (props) => {
  const { album } = props;

  let { id } = useParams();

  let [currentAlbum] = album.filter((item) => 
  //At the beginning of development, item.id returned a number and id return a string
    item.id == id
  );

  const [num, setNum] = useState(0);

  const allAlbumPhotos = currentAlbum.photos.albumPhotos;

  const numIncrement = useCallback(() => {
    if (num >= allAlbumPhotos.length - 1) {
      setNum(0);
    } else {
      setNum(num + 1);
    }
  }, [num]);

  const numDecrement = useCallback(() => {
    if (num <= 0) {
      setNum(allAlbumPhotos.length - 1);
    } else {
      setNum(num - 1);
    }
  }, [num]);

  function handler({ key }) {
    if (key === 'ArrowRight') {
      if (num >= allAlbumPhotos.length - 1) {
        setNum(0);
      } else {
        setNum(num + 1);
      }
    } else if (key === 'ArrowLeft') {
      if (num <= 0) {
        setNum(allAlbumPhotos.length - 1);
      } else {
        setNum(num - 1);
      }
    }
  }

  useEventListener('keydown', handler);

  return (
    <div className="album-photos">
      <div className="current-photo">
        <button
          type="button"
          className="prev-photo btn btn-secondary mr-1"
          onClick={numDecrement}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="currentColor"
            class="bi bi-chevron-double-left"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            />
            <path
              fill-rule="evenodd"
              d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            />
          </svg>
        </button>
        <img src={allAlbumPhotos[num].filename} alt="photo" />
        <button
          type="button"
          className="next-photo btn btn-secondary ml-1"
          onClick={numIncrement}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="currentColor"
            class="bi bi-chevron-double-right"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
            />
            <path
              fill-rule="evenodd"
              d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>
        <NavLink to='/' className='close'>&times;</NavLink>
      </div>
      <div className="all-photos">
        {allAlbumPhotos.map((photo, i) => (
          <img src={photo.filename} className={i === num ? `active-photos` : ''} key={i + Math.random()}/>
        ))}
      </div>
    </div>
  );
};

export default AlbumPhoto;

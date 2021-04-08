import CreateAlbum from "./CreateAlbum";
import LoadingPhotos from "./LoadingPhotos";

const Header = (props) => {
  const { photos, id } = props;
  return (
    <div className="d-flex justify-content-around align-items-center sticky-top bg-light mb-2">
      {id !== null ? (
        <>
          <CreateAlbum photos={photos} id={id} />
          <h1>Фото галерея</h1>
          <LoadingPhotos id={id} />
        </>
      ) : (
        <h1 className="header-not-auth">Фото галерея</h1>
      )}
    </div>
  );
};

export default Header;

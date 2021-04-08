import NewAlbum from "./NewAlbum";
import Photo from "./Photo";

const Gallery = (props) => {
  const {photos, album, userId} = props;

  return (
    <div>
      {album.map((item, i) => (
        //I guess I'm using bad practice for adding keys. Better to use uuid
        <NewAlbum album={item} userId={userId} key={i + Math.random()} />
      ))}
      {photos.map((item, i) => (
        <Photo photo={item} userId={userId} key={i + Math.random()} />
      ))}
    </div>
  );
};

export default Gallery;

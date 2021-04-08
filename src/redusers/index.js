import { createSlice } from "@reduxjs/toolkit";

export const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    userPhoto: {
      userAlbum: [],
      userPhotos: [],
    },
    userId: null,
    error: "",
  },

  reducers: {
    addPhoto: (state, action) => {
      state.userPhoto.userPhotos.push(action.payload);
    },
    addAllPhoto: (state, action) => {
      state.userPhoto = action.payload;
    },
    removePhoto: (state, action) => {
      state.userPhoto.userPhotos = state.userPhoto.userPhotos.filter(
        (item) => item.path !== action.payload
      );
    },
    checkPhoto: (state, action) => {
      state.userPhoto.userPhotos.forEach((item) => {
        if (item.path === action.payload) {
          item.check = !item.check;
        }
      });
    },
    createAlbum: (state, action) => {
      let albumPhotos = state.userPhoto.userPhotos.filter((item) => item.check);

      let newAlbum = {
        names: action.payload.str,
        photos: { albumPhotos },
        id: action.payload.id,
      };

      state.userPhoto.userAlbum.push(newAlbum);

      state.userPhoto.userPhotos = state.userPhoto.userPhotos.filter(
        (item) => !item.check
      );
    },
    removeAlbumFromPhoto: (state, action) => {
      state.userPhoto.userAlbum = state.userPhoto.userAlbum.filter(
        (item) => item.names !== action.payload
      );
    },
    removeAlbumWithoutPhoto: (state, action) => {
      state.userPhoto.userAlbum.map((item) => {
        if (item.names === action.payload) {
          item.photos.albumPhotos.map((item) => {
            item.check = false;
            state.userPhoto.userPhotos.push(item);
          });
        }
      });
      state.userPhoto.userAlbum = state.userPhoto.userAlbum.filter(
        (item) => item.names !== action.payload
      );
    },
    errorServ: (state, action) => {
      state.error = action.payload;
    },
    addUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const removePhotoServ = (path, id) => (dispatch) => {
  ajax("/remove", "DELETE", { path, id })
    .then((res) => {
      // perhaps better: (res.status >= 200 && res.status < 300)?
      if (res.status < 300) {
        dispatch(removePhoto(path));
      } else {
        dispatch(errorServ("res.status " + res.status));
      }
    })
    .catch((err) => dispatch(errorServ("" + err)));
};

export const checkPhotoServ = (path, id) => (dispatch) => {
  ajax("/check", "PUT", { path, id })
    .then((res) => {
      if (res.status < 300) {
        dispatch(checkPhoto(path));
      } else {
        dispatch(errorServ("res.status " + res.status));
      }
    })
    .catch((err) => dispatch(errorServ("" + err)));
};

export const createAlbumServ = (str, id) => (dispatch) => {
  ajax("/createAlbum", "POST", { str, id })
    .then((res) => {
      if (res.status < 300) {
        res.json().then((data) => {
          str = data.str;
          id = data.newId;

          dispatch(createAlbum({ str, id }));
        });
      } else {
        dispatch(errorServ("res.status " + res.status));
      }
    })

    .catch((err) => dispatch(errorServ("" + err)));
};

export const removeAlbumWithoutPhotoServ = (id, names) => (dispatch) => {
  ajax("/removeAlbumWithoutPhoto", "DELETE", { id, names })
    .then((res) => {
      if (res.status < 300) {
        dispatch(removeAlbumWithoutPhoto(names));
      } else {
        dispatch(errorServ("res.status " + res.status));
      }
    })
    .catch((err) => dispatch(errorServ("" + err)));
};

export const removeAlbumFromPhotoServ = (id, names) => (dispatch) => {
  ajax("/removeAlbumFromPhoto", "DELETE", { id, names })
    .then((res) => {
      if (res.status <   300) {
        dispatch(removeAlbumFromPhoto(names));
      } else {
        dispatch(errorServ("res.status " + res.status));
      }
    })
    .catch((err) => dispatch(errorServ("" + err)));
};

let ajax = (url, method, body = {}) => {
  let settings = {
    method,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json",
    },
  };
  if (Object.keys(body).length !== 0) {
    settings.body = JSON.stringify(body);
  }
  return fetch(url, settings);
};

export const {
  addPhoto,
  addAllPhoto,
  removePhoto,
  checkPhoto,
  createAlbum,
  removeAlbumFromPhoto,
  removeAlbumWithoutPhoto,
  errorServ,
  addUserId,
} = gallerySlice.actions;

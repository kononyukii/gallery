const express = require("express");
const { resolve } = require("path");
const fs = require("fs").promises;
const bodyParser = require("body-parser");
const app = express();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const GalleryDb = require("./models/GalleryDb");
const { body, validationResult } = require("express-validator");

const validators = [
  body("name").custom((value) => {
    const regexName = /[А-ЯЁІЇҐЄ\w-]{2,10}/i;

    if (!regexName.test(value)) return false;

    return true;
  }),
  body("email").custom((value) => {
    const regexEmail = /^[a-zA-Z0-9-]+[a-zA-Z0-9-\.]*[a-zA-Z0-9-]+@[a-zA-Z0-9-]+[a-zA-Z0-9-\.]*\.[a-zA-Z0-9-]{2,}$/i;

    if (!regexEmail.test(value)) return false;

    return true;
  }),

  body("password").custom((value) => {
    const regexPassword = /^[A-Z0-9_-]{4,12}$/i;

    if (!regexPassword.test(value)) return false;

    return true;
  }),
];

app.use(bodyParser.json());

mongoose.set("toJSON", {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  },
});

const bcrypt = require("bcrypt");

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resolve(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `/${uuidv4()}${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//Perhaps it was better to split the configuration and the server into different files?

app.use(
  "/:upload(upload)?/:login(login)?/:id(\\w+)?",
  multer({ storage: storageConfig, fileFilter }).single("filedata")
);

app.post("/registration", validators, async function (req, res) {
  try {
    const { errors } = validationResult(req);

    if (errors.length) {
      throw new Error("Введены неверные данные регистрации");
    }

    const data = req.body;
    const { name, email, password } = data;

    const checkOut = await GalleryDb.findOne({ email });

    if (checkOut) {
      throw new Error(`Email: ${email} уже существует`);
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new GalleryDb({
      name,
      email,
      userGallery: { userAlbum: [], userPhotos: [] },
      password: hashPass,
    });

    await newUser.save();
    delete newUser.password;
    res.json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

app.post("/login", async function (req, res) {
  try {
    const data = req.body;
    const { email, password } = data;

    const checkOut = await GalleryDb.findOne({ email });

    if (!checkOut) {
      throw new Error(
        "Пользователь не существует, зарегистрируйтесь пожалуйста"
      );
    }

    const user = checkOut.toJSON();

    if (await bcrypt.compare(password, user.password)) {
      delete user.password;
      res.json({ data: user });
    } else {
      throw new Error("Неверный email или пароль");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/upload/:id", async function (req, res) {
  try {
    let {
      file,
      params: { id },
    } = req;

    const userGallery = await GalleryDb.findById(id);

    if (!userGallery) {
      throw new Error("Gallery is not found");
    }

    const gallery = userGallery.toObject();

    let { filename, size, path } = file;

    let newDate = new Date();
    let now =
      addZero(newDate.getDate()) +
      "." +
      addZero(newDate.getMonth() + 1) +
      "." +
      addZero(newDate.getFullYear());

    let newFilesData = { filename, size, path, date: now, check: false };

    gallery.userGallery.userPhotos.push(newFilesData);

    await GalleryDb.findByIdAndUpdate(id, gallery);

    res.json(newFilesData);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error. Failed to send..." });
  }
});

app.delete("/remove", async (req, res) => {
  try {
    let { path, id } = req.body;

    const userGallery = await GalleryDb.findById(id);

    if (!userGallery) {
      throw new Error("Gallery is not found");
    }

    await fs.unlink(path, (err) => {
      if (err) throw err;
      console.log("path/file.txt was deleted");
    });

    const gallery = userGallery.toObject();

    gallery.userGallery.userPhotos = gallery.userGallery.userPhotos.filter(
      (item) => item.path !== path
    );

    await GalleryDb.findByIdAndUpdate(id, gallery);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

app.put("/check", async (req, res) => {
  try {
    let { path, id } = req.body;

    const userGallery = await GalleryDb.findById(id);

    if (!userGallery) {
      throw new Error("Gallery is not found");
    }

    const gallery = userGallery.toObject();

    gallery.userGallery.userPhotos.forEach((item) => {
      if (item.path === path) {
        item.check = !item.check;
      }
    });

    await GalleryDb.findByIdAndUpdate(id, gallery);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

app.post("/createAlbum", async (req, res) => {
  try {
    let { str, id } = req.body;

    const userGallery = await GalleryDb.findById(id);

    if (!userGallery) {
      throw new Error("Gallery is not found");
    }

    const gallery = userGallery.toObject();

    let checkName;

    const newName = () => {
      checkName = gallery.userGallery.userAlbum.some(
        (item) => item.names === str
      );

      if (checkName) {
        str = `New ${str}`;
        newName();
      }
    };
    newName();

    let albumPhotos = gallery.userGallery.userPhotos.filter(
      (item) => item.check
    );

    let newAlbum = {
      names: str,
      photos: { albumPhotos },
    };

    gallery.userGallery.userAlbum.push(newAlbum);

    gallery.userGallery.userPhotos = gallery.userGallery.userPhotos.filter(
      (item) => !item.check
    );

    await GalleryDb.findByIdAndUpdate(id, gallery);

    const newUserGallery = await GalleryDb.findById(id);
    const newGallery = newUserGallery.toJSON();
    const album = newGallery.userGallery.userAlbum.filter(
      (item) => item.names === str
    );

    let newId = album[0].id;

    res.json({ newId, str });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

app.delete("/removeAlbumWithoutPhoto", async (req, res) => {
  try {
    let { names, id } = req.body;

    const userGallery = await GalleryDb.findById(id);

    if (!userGallery) {
      throw new Error("Gallery is not found");
    }

    const gallery = userGallery.toObject();

    gallery.userGallery.userAlbum.map((item) => {
      if (item.names === names) {
        item.photos.albumPhotos.map((item) => {
          item.check = false;
          gallery.userGallery.userPhotos.push(item);
        });
      }
    });

    gallery.userGallery.userAlbum = gallery.userGallery.userAlbum.filter(
      (item) => item.names !== names
    );

    await GalleryDb.findByIdAndUpdate(id, gallery);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

app.delete("/removeAlbumFromPhoto", async (req, res) => {
  try {
    let { names, id } = req.body;

    const userGallery = await GalleryDb.findById(id);

    if (!userGallery) {
      throw new Error("Gallery is not found");
    }

    const gallery = userGallery.toObject();

    await gallery.userGallery.userAlbum.map((item) => {
      if (item.names === names) {
        item.photos.albumPhotos.map((item) => {
          fs.unlink(item.path, (err) => {
            if (err) throw err;
            console.log("path/file.txt was deleted");
          });
        });
      }
    });

    gallery.userGallery.userAlbum = gallery.userGallery.userAlbum.filter(
      (item) => item.names !== names
    );

    await GalleryDb.findByIdAndUpdate(id, gallery);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

app.get(
  "/:upload(upload)?/:login(login)?/:registration(registration)?/:album(album)?/:id(\\w+)?",
  (req, res) => res.sendFile(resolve(__dirname, "build", "index.html"))
);

app.use(express.static(resolve(__dirname, "build")));
app.use(express.static(resolve(__dirname, "uploads")));

function addZero(num) {
  if (num >= 0 && num <= 9) {
    return "0" + num;
  } else {
    return num;
  }
}

async function start() {
  try {
    await mongoose.connect(
      "mongodb+srv://kononyuk:12345a@cluster0.jhm3w.mongodb.net/gallery",
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );
    app.listen(8000);
  } catch (error) {
    console.log(error);
  }
}

start();

const { model, Schema } = require("mongoose");

const schema = new Schema([
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    userGallery: {
      userAlbum: [
        {
          names: {
            type: String,
            required: true,
          },
          photos: {
            albumPhotos: [
              {
                filename: {
                  type: String,
                  required: true,
                },
                size: {
                  type: Number,
                  required: true,
                },
                path: {
                  type: String,
                  required: true,
                },
                date: {
                  type: String,
                  required: true,
                },
                check: {
                  type: Boolean,
                  default: false,
                  required: true,
                },
              },
            ],
          },
        },
      ],
      userPhotos: [
        {
          filename: {
            type: String,
            required: true,
          },
          size: {
            type: Number,
            required: true,
          },
          path: {
            type: String,
            required: true,
          },
          date: {
            type: String,
            required: true,
          },
          check: {
            type: Boolean,
            default: false,
            required: true,
          },
        },
      ],
    },

    password: {
      type: String,
      required: true,
    },
  },
]);

schema.method('transform', function() {
  let obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;

  return obj;
})

module.exports = model("GalleryDb", schema);

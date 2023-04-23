import { upload } from "../utils/imageUpload.js";
import User from "../model/userSchema.js";
import logger from "../utils/logger.js";

export const uploadAvatar = async (req, res) => {
  const { id } = req.user;
  try {
    if (!id) {
      return res.status(404).send("Token expired");
    }
    const user = await User.findOne({ email: id });

    if (!user) {
      return res.status(404).send("User not found");
    }

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).send("Error uploading image");
      }
      if (!req.file) {
        return res.status(400).send("Ensure you have selected an image file");
      }

      const uploadingImg = User.updateOne(
        {
          email: id,
        },
        {
          $set: {
            avatar: req.file.path,
          },
        }
      );

      if (uploadingImg) {
        return res.status(200).send("Uploaded Successfully");
      } else {
        return res.status(500).send("Something went wrong");
      }
    });
  } catch (error) {
    logger.debug(error);
    return res.status(500).send(error);
  }
};

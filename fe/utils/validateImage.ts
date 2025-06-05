type ImageFile = {
  uri: string;
  name: string;
  type: string;
  size: number; // in bytes
};

const validateImage = (file: ImageFile) => {
  const errorMsgs: string[] = [];

  const isImage = file.type.split("/")[0] === "image";
  const isTypeValid =
    file.type.split("/")[1] === "png" ||
    file.type.split("/")[1] === "jpg" ||
    file.type.split("/")[1] === "jpeg";

  if (!isImage) {
    errorMsgs.push(`'${file.name}' is not an image file`);
  }

  if (!isTypeValid) {
    errorMsgs.push(`'${file.name}' is not a png, jpeg, or jpg image`);
  }

  const isLessThan3MB = file.size / 1024 / 1024 < 3;
  if (!isLessThan3MB) {
    errorMsgs.push(`Image must be smaller than 3MB!`);
  }

  return errorMsgs;
};

//usage in ui:
// import * as ImagePicker from "expo-image-picker";
// import * as FileSystem from "expo-file-system";

// const pickImage = async () => {
//   const result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     allowsEditing: false,
//     quality: 1,
//   });

//   if (!result.canceled) {
//     const asset = result.assets[0];

//     // Get file info for size
//     const fileInfo = await FileSystem.getInfoAsync(asset.uri);
//     const file = {
//       uri: asset.uri,
//       name: asset.fileName ?? "image.jpg",
//       type: asset.type ?? "image/jpeg",
//       size: fileInfo.size ?? 0,
//     };

//     const errors = validateImage(file);
//     if (errors.length > 0) {
//       alert(errors.join("\n"));
//     } else {
//       // proceed with upload or processing
//       console.log("Image valid:", file);
//     }
//   }
// };

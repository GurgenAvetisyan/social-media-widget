import {
  SOCIAL_PROVIDER_ALIAS_FACEBOOK,
  SOCIAL_PROVIDER_ALIAS_INSTAGRAM,
  SOCIAL_PROVIDER_ALIAS_LINKEDIN,
  SOCIAL_PROVIDER_ALIAS_TWITTER,
  SOCIAL_PROVIDER_KEY_FACEBOOK,
  SOCIAL_PROVIDER_KEY_INSTAGRAM,
  SOCIAL_PROVIDER_KEY_LINKEDIN,
  SOCIAL_PROVIDER_KEY_TWITTER,
} from "./config";

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const uniqueId = () =>
  `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const compressImage = (
  file,
  maxWidth = Infinity,
  maxHeight = Infinity,
  quality = 0.6
) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Create an object URL for the image file
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
    };
    reader.onerror = function (err) {
      reject(err);
    };

    reader.readAsDataURL(file);

    img.onload = function () {
      // Create canvas to draw the image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Calculate the aspect ratio and dimensions to fit within maxWidth and maxHeight
      let { width, height } = img;

      let newWidth = width;
      let newHeight = height;

      if (maxWidth !== Infinity || maxHeight !== Infinity) {
        if (width > height && width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        } else if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // to do
      // if (width > height) {
      //   console.log('width > height');
      //   if (width > maxWidth) {
      //     console.log(width > maxWidth,"width > maxWidth");
      //     newWidth = maxWidth;
      //     newHeight = Math.round((height * maxWidth) / width);
      //   }
      // } else {
      //   if (height > maxHeight) {
      //     newHeight = maxHeight;
      //     newWidth = Math.round((width * maxHeight) / height);
      //   }
      // }

      // Set the canvas size
      canvas.width = newWidth;
      canvas.height = newHeight;
      // Draw the image onto the canvas with new size
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      // Compress the image by converting the canvas to a blob with specified quality
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob); // Return the compressed image as a blob
          } else {
            reject("Compression failed");
          }
        },
        "image/jpeg", // Output format (image/jpeg, image/png, etc.)
        quality // Quality setting (0.0 to 1.0)
      );
    };
  });
};

export const handleCompressedFiles = async (files) => {
  const compressedFiles = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const compressedBlob = await compressImage(file, Infinity, Infinity, 0.6);
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
      });

      compressedFiles.push({ id: uniqueId(), file: compressedFile });
    } catch (error) {
      console.error("Image compression failed for file:", file.name, error);
    }
  }
  return compressedFiles;
};

export const handlePageImageError = (e, userIcon) => {
  e.currentTarget.src = userIcon;
};

export const removeUrlParameter = (paramName) => {
  const url = new URL(window.location.href);
  url.searchParams.delete(paramName);
  window.history.replaceState(null, "", url.toString());
};

const capitalizedProviderName = (providerName) => {
  if (typeof providerName !== "string") {
    return "";
  }
  return providerName.charAt(0).toUpperCase() + providerName.slice(1);
};

export const handleDisplayingToastSuccessfulConnection = (data, callBack) => {
  const urlSearch = new URLSearchParams(window.location.search);
  const providerKey = urlSearch.has("providerKey")
    ? Number(urlSearch.get("providerKey"))
    : null;

  if (!providerKey) return;

  const providerMap = {
    [SOCIAL_PROVIDER_KEY_FACEBOOK]: SOCIAL_PROVIDER_ALIAS_FACEBOOK,
    [SOCIAL_PROVIDER_KEY_INSTAGRAM]: SOCIAL_PROVIDER_ALIAS_INSTAGRAM,
    [SOCIAL_PROVIDER_KEY_LINKEDIN]: SOCIAL_PROVIDER_ALIAS_LINKEDIN,
    [SOCIAL_PROVIDER_KEY_TWITTER]: SOCIAL_PROVIDER_ALIAS_TWITTER,
  };

  const providerAlias = providerMap[providerKey];
  if (providerAlias && data?.[`${providerAlias}Connected`]) {
    callBack(capitalizedProviderName(providerAlias));
    removeUrlParameter("providerKey");
  }
};

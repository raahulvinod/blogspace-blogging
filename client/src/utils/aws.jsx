import axios from 'axios';

export const uploadImage = async (image) => {
  let imgUrl = null;

  try {
    const response = await axios.get(
      import.meta.env.VITE_SERVER_DOMAIN + '/get-upload-url'
    );
    const uploadUrl = response.data.uploadURL;

    await axios({
      method: 'PUT',
      url: uploadUrl,
      headers: { 'Content-Type': 'multipart/form-data' },
      data: image,
    });

    imgUrl = uploadUrl.split('?')[0];
  } catch (error) {
    console.error('Image upload failed:', error);
  }

  return imgUrl;
};

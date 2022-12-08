import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31846910-d92a45aa9c1fee0fb7faf0751';
const per_page = 40;

export const fetchApi = async (name, page, language) => {
  const result = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${name}&images_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}&lang=${language}`
  );
  // console.log(result);
  return result.data;
};

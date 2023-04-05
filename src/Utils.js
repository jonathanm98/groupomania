import axios from "axios";

export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

export const dateParser = (num) => {
  let options = {
    hour: "2-digit",
    minute: "2-digit",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  };

  let timestamp = Date.parse(num);

  let date = new Date(timestamp)
    .toLocaleDateString("fr-FR", options)
    .replace(",", " à ");

  if (date === "Invalid Date") return "Maintenant";
  return date.toString();
};

export const timestampParser = (num) => {
  let options = {
    hour: "2-digit",
    minute: "2-digit",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  };

  let date = new Date(num)
    .toLocaleDateString("fr-FR", options)
    .replace(",", " à ");

  return date.toString();
};

export const youtubeData = async (videoId) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
    );

    if (response.data.items.length > 0) {
      return response.data.items[0].snippet;
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching video title:', error);
    return null;
  }
};
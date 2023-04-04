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

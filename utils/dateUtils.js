export const getLocalDateString = () => {
  const currentDateObj = new Date();
  return (
    currentDateObj.getFullYear() +
    "-" +
    String(currentDateObj.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(currentDateObj.getDate()).padStart(2, "0")
  );
};

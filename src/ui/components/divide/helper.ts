export default function divide(params) {
  if (!params[1]) return 0;
  return Math.floor(parseFloat(params[0]) / parseFloat(params[1]));
};

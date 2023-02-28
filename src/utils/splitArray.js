export function splitArray(array) {
  const lengthArray = array.length;
  const lengthSubArray = 10;
  const subArrays = [];

  for (let i = 0; i < lengthArray; i += lengthSubArray) {
    const subArray = array.slice(i, i + lengthSubArray);
    subArrays.push(subArray);
  }

  return subArrays;
}

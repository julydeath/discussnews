export function generateRandomNumber(length: number): number {
  if (length <= 0) throw new Error("Length must be greater than 0");

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor(Math.random() * (max - min + 1) + min);
}

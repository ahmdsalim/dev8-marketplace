export default function UcWords(str) {
  return str.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}
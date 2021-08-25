const colours = ['red', 'blue', 'green', 'purple', 'gray', 'yellow', 'indigo'];
export default function getRandomColor() {
  return colours[Math.floor(Math.random() * colours.length)];
}

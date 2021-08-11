const colours = ['red', 'blue', 'green', 'purple', 'gray']
export default function getRandomColor() {
  return colours[Math.floor(Math.random() * colours.length)]
}

import { createRoot } from "react-dom/client";


const App = () => {
  return <p>Hello World</p>;
}

const container = document.getElementById("root");
const root = createRoot(container);
console.log("It's coming here");
root.render(<App />)
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import GameBoard from "./components/GameBoard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        <h3>Lava game</h3>
        <GameBoard />
      </div>
    </div>
  );
}

export default App;

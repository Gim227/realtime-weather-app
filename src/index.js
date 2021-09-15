import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import WeatherApp from "./WeatherApp";

function App() {
  return <WeatherApp />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

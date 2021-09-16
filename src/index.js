import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import WeatherApp from "./WeatherApp";
import * as serviceWorker from './serviceWorker';

function App() {
  // This effect runs once, after the first render
  useEffect(() => {
    document.title = "臺灣即時天氣"

    // var link = document.querySelector("link[rel~='icon']");
    // if (!link) {
    //     link = document.createElement('link');
    //     link.rel = 'icon';
    //     document.head.appendChild(link);
    // }
    // link.href = "./images/day-clear.svg";

  }, [])

  return <WeatherApp />;
}
// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);

ReactDOM.render(<WeatherApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

// 將 unregister 改成 register
serviceWorker.register();
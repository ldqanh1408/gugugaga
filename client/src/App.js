// filepath: /e:/learnLongLife/Competition/New_Project/client/src/App.js
import logo from "./logo.svg";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import AppRouter from "./Router/AppRouter";
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
        <AppRouter />
  );
}

export default App;
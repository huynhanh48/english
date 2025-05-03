import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { request } from "./models/request";
import logo from "/logo.svg";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout/layout";
import Home from "./components/home";

function App() {
  // useEffect(() => {
  //   request.get("/fuch").then((value) => {
  //     console.log(value);
  //   });
  //   console.log("con cai nit");
  // }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;

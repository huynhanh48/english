import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./topbar";

export default function Layout() {
  return (
    <div className="container ">
      <header>
        <Topbar />
      </header>
      <Outlet />
      <footer>footer</footer>
    </div>
  );
}

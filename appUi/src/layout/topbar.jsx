import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import logo from "/logo.svg";
import { FaMailchimp } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { request } from "../models/request";

export default function Topbar() {
  const [word, setWord] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await request
      .get(`/${word}`)
      .then((value) => {
        return value.data;
      })
      .catch(console.error);
    console.log(data);
  };
  const handleInput = (e) => {
    setWord(e.target.value);
    console.log(e.target.value);
  };
  return (
    <header className="h-16 px-2 bg-[#e2f1ff] font-poppins flex   justify-between items-center">
      <div className="mr-2 size-12 bg-green-600 rounded-full flex-center">
        <button className="">
          <FaMailchimp className="text-4xl text-white" />
        </button>
      </div>
      <div className="h-full w-sm flex-center  mx-auto   relative">
        <form
          onSubmit={handleSubmit}
          className="w-full h-3/4 flex-center focus-within:border-blue-400  border border-gray-400 rounded-xs bg-white"
        >
          <input
            value={word}
            onChange={handleInput}
            type="text"
            className="size-full px-4 outline-0"
            placeholder="Search. . . "
          />
          <button
            type="submit"
            className="w-12  cursor-pointer flex-center h-full bg-blue-300"
          >
            <IoSearch className="text-2xl " />
          </button>
        </form>
      </div>
    </header>
  );
}

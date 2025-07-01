"use client";
import { useState } from "react";
import "../styles/homepage/mainPage.css";
import minesGameImg from "./../../public/jpeg/screen_mi-1.jpeg";
import Image from "next/image";
import { Modal } from "@/components/page-components/homePage/Modal";

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  const handlePlayClick = () => {
    setShowModal(true);
  };

  const handleAgeResponse = (is18: boolean) => {
    setShowModal(false);
    if (is18) {
      window.location.href = "/mines";
    } else {
      alert("You must be 18 or older to play.");
    }
  };

  return (
    <main className="main-page-container">
      <h1 className="main-title">mines</h1>
      <Image src={minesGameImg} alt="minesGame" className="main-page-img" />
      <button onClick={handlePlayClick} className="play-btn">
        Play Demo
      </button>
      {showModal && <Modal handleAgeRespones={handleAgeResponse} />}
    </main>
  );
}

"use client";
import React from "react";
import "@/styles/minesGamePage/minesGameContent.css";
import { MinesGrid } from "./MinesGrid";
import { ContentHeader } from "./ContentHeader";

export const MinesGameContent = () => {
  return (
    <div className="content-main-container">
      <ContentHeader />
      <MinesGrid />
    </div>
  );
};

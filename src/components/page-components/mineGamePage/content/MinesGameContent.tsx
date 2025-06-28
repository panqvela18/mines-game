"use client";
import React from "react";
import "@/styles/minesGamePage/minesGameContent.css";
import { MinesGrid } from "./MinesGrid";
import { ContentHeader } from "./ContentHeader";
import ContentFooter from "./ContentFooter";

export const MinesGameContent = () => {
  return (
    <div className="content-main-container">
      <ContentHeader />
      <MinesGrid />
      <ContentFooter />
    </div>
  );
};

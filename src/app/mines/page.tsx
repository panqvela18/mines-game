import React from "react";
import "@/styles/minesGamePage/minesMain.css";
import { MinesHeader } from "@/components/mineGamePage/MinesHeader";
import { MinesGameContent } from "@/components/mineGamePage/MinesGameContent";
import { MinesFooter } from "@/components/mineGamePage/MinesFooter";

export default function MinesPage() {
  return (
    <main className="minesGame-main-container">
      <section className="minesGame-container">
        <MinesHeader />
        <MinesGameContent />
        <MinesFooter />
      </section>
    </main>
  );
}

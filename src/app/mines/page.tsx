import React from "react";
import "@/styles/minesGamePage/minesMain.css";
import { MinesHeader } from "@/components/page-components/mineGamePage/header/MinesHeader";
import { MinesGameContent } from "@/components/page-components/mineGamePage/content/MinesGameContent";
import { MinesFooter } from "@/components/page-components/mineGamePage/footer/MinesFooter";

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

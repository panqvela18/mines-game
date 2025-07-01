import React from "react";
import "@/styles/minesGamePage/burgerMenu.css";
import Checkbox from "@/components/ui/Checkbox";
import { burgerMenuOptions } from "@/utils/constants";
import Link from "next/link";
import Image from "next/image";
import { useGameStore } from "@/store/useGameStore";

export const BurgerMenu = () => {
  const { isSoundOn, setIsSoundOn } = useGameStore();
  const handleSoundToggle = (checked: boolean) => {
    setIsSoundOn(checked);
  };

  return (
    <div className="burger-container">
      <div className="sound-container">
        <div className="sound-wrapper">
          <Image
            src={
              "https://turbo.spribegaming.com/icon-volume.51f0459605884b08.svg"
            }
            alt="sound-icon"
            width={16}
            height={16}
          />
          <h5>Sound</h5>
        </div>
        <Checkbox
          id="sound-toggle"
          checked={isSoundOn}
          onChange={handleSoundToggle}
          className="custom-checkbox"
        />
      </div>
      <nav>
        <ul>
          {burgerMenuOptions.map((options) => {
            return (
              <li key={options.id}>
                <Link href={"#"}>
                  <Image
                    src={options.iconImgUrl}
                    alt={options.nav}
                    width={16}
                    height={16}
                  />
                  {options.nav}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <Link href={"/"} className="back-home">
        <Image
          src={"https://turbo.spribegaming.com/icon-home.f34eb6cc9d4c0927.svg"}
          alt="home-icon"
          width={16}
          height={16}
        />
        Back to home
      </Link>
      <div className="line" />
      <div className="burger-menu-footer">
        <div className="brg-footer-left">
          <Image
            src={
              "https://turbo.spribegaming.com/icon-provaby-fair.4f566a4692338648.svg"
            }
            alt="fair-icon"
            width={16}
            height={16}
          />
          <span>Provably Fair Settings</span>
        </div>
        <div className="brg-footer-right">
          <span>©</span>
          <Image
            src={
              "https://turbo.spribegaming.com/icon-logo.07e2fb9b2553a082.svg"
            }
            alt="logo"
            width={34}
            height={14}
          />
        </div>
      </div>
    </div>
  );
};

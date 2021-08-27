import React from "react";
import style from "../styles.module.css";

export default function BackToTop() {
  return (
    <button onClick={() => window.scrollTo(0, 0)} className={style.toTop}>
      To Top
    </button>
  );
}

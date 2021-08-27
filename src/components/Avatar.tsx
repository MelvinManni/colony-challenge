import { createRef, useEffect, useRef } from "react";
import style from "../styles.module.css";
import generateAvatar from "../utils/generateAvatar";

export default function Avatar(props: { seed: string }) {
  const avatarRef = createRef<HTMLDivElement>();
  useEffect(() => {
    avatarRef.current?.appendChild(generateAvatar(props.seed));
  }, []);

  return <div className={style.avatar} ref={avatarRef}></div>;
}

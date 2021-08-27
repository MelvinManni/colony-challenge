import style from "../styles.module.css";
import generateAvatar from "../utils/generateAvatar";

export default function Avatar(props: { seed: string }) {
  return <img src={generateAvatar(props.seed)} alt="avatar" className={style.avatar} />;
}

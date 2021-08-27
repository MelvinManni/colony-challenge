import style from "../styles.module.css";
import { dateFormater } from "../utils";
import Avatar from "./Avatar";

interface EventItemProps {
  children: Element;
  date: Date;
  avatar: string;
}

export default function EventItem(props: EventItemProps) {
  return (
    <div className={style.listItem}>
      <div className={style.row}>
        <Avatar seed={props.avatar} />
        <div className={style.mr} >
          {props.children}
          <p className={style.text + " " + style.textSmall}>{dateFormater(props.date)}</p>
        </div>
      </div>
    </div>
  );
}

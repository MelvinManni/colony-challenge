import style from "../styles.module.css";
import Avatar from "./Avatar";

interface EventItemProps {
  children: Element;
  date: Date;
  avatar: string;
}

export default function EventItem(props: EventItemProps) {
  return (
    <div className={style.listItem}>
      <Avatar seed={props.avatar} />
      {props.children}
    </div>
  );
}

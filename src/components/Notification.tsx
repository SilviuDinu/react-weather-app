export default function Notification(props: any) {
  return (
    <>
      {props.isVisible ? (
        <div className={props.type}>
          <span>{props.message}</span>
        </div>
      ) : null}
    </>
  );
}

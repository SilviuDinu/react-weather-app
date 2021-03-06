export default function Button(props: any) {
  const { isSubmitButton = false } = props;
  const buttonType = isSubmitButton ? "submit" : undefined;
  return (
    <button
      aria-label={props.text}
      type={buttonType}
      className={"btn " + props.type}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}

export default function Button(props: any) {
    return (
     <button
        className={'btn ' + props.type}
        onClick={props.onClick}>
         {props.text}
     </button>
    );
}

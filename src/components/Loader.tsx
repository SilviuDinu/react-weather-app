export default function Loader(props: any) {
    return (
        props.isLoading ? <div className="loader"></div> : null
    );
}
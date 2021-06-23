export default function Loader(props: any) {
  return props.isLoading ? (
    <div className="loader-wrapper">
      <div className="spinner"></div>
    </div>
  ) : null;
}

import Button from "@components/Button";

export default function SearchForm(props: any) {
  const { form } = props;

  return (
    <form className={form.class}>
      <input
        type="text"
        name="name"
        autoComplete="on"
        className={form.input.class}
        placeholder={form.input.placeholder}
        aria-label={form.input.ariaLabel}
        value={props.inputValue}
        onChange={(event) => props.onInputChange(event)}
      />
      <Button
        type="primary"
        isSubmitButton={true}
        text={form.buttonText}
        onClick={props.onFormSubmit}
      />
    </form>
  );
}

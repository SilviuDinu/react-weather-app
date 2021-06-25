import Button from "@components/Button/Button";
import { MESSAGES } from '@enums/misc.enum';
import { NotificationContext } from '@providers/NotificationContext';
import { SearchParamsContext } from "@providers/SearchParamsContext";
import { useEffect } from 'react';
import { useState } from 'react';
import { ChangeEvent, useContext } from "react";

export default function SearchForm(props: any) {
  const { form } = props;
  const [searchParams, setSearchParams] = useState({
    searchValue: "",
    lat: null,
    lon: null,
    submitted: false,
  });
  const [, setNotification] = useContext(NotificationContext);

  useEffect(() => {
    if (searchParams.submitted) {
      props.onFormSubmit(searchParams);
    }
    return () => setSearchParams({
      ...searchParams,
      searchValue: '',
      submitted: false
    })
  }, [searchParams.submitted]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value || "";
    setSearchParams({
      ...searchParams,
      submitted: false,
      searchValue: val,
    });
  };

  const onFormSubmit = (e: Event): void => {
    if (e) {
      e.preventDefault();
    }
    if (!searchParams.searchValue) {
      setNotification({
        severity: "warning",
        message: MESSAGES.EMPTY_FIELD_ERROR,
        isVisible: true,
      });
      return;
    }
    setSearchParams({
      ...searchParams,
      submitted: true,
    });
  };

  return (
    <form className={form.class}>
      <input
        type="text"
        name="name"
        autoComplete={form.input.autocomplete ? "on" : "off"}
        className={form.input.class}
        placeholder={form.input.placeholder}
        aria-label={form.input.ariaLabel}
        value={searchParams.searchValue}
        onChange={onInputChange}
      />
      <Button
        type="primary"
        isSubmitButton={true}
        text={form.buttonText}
        onClick={onFormSubmit}
      />
    </form>
  );
}

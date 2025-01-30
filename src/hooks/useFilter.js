import { useLocation, useNavigate } from "react-router-dom";
import FormType from "../constants/FormType";

export const EQUAL_SIGN = "~";
export const AND_SIGN = "+";
export const ARRAY_SEPARATOR = "--";

function parseUrl(url) {}

function stringifyUrl(data) {}

// TODO: complete this hook
function useFilter(formData) {
  console.log(formData);
  const location = useLocation();
  const navigate = useNavigate();

  const filterState = {};

  const setFilterState = (s) => {};
  function onChange(e, name, type) {}

  function onClear(name) {}
  function onClearAll() {}
  return { filterState, setFilterState, onChange, onClear, onClearAll };
}

export default useFilter;

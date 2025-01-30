import { useLocation, useNavigate } from "react-router-dom";
import FormType from "../constants/FormType";
import { useCallback } from "react";

export const EQUAL_SIGN = "~";
export const AND_SIGN = "+";
export const ARRAY_SEPARATOR = "--";

function parseUrl(url) {
  const temp = {};

  if (!url) return temp;

  const separatorRegex = new RegExp(`[${EQUAL_SIGN}${AND_SIGN}]`, "g");
  const arrKeyValue = url?.split(separatorRegex);

  let i = 0;
  while (i < arrKeyValue.length) {
    const key = arrKeyValue[i];
    const value = arrKeyValue[i + 1];
    temp[key] = decodeURIComponent(value);

    i += 2;
  }

  return temp;
}

function stringifyUrl(data) {
  return Object.entries(data)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return key + EQUAL_SIGN + value.join(ARRAY_SEPARATOR);
      }
      return key + EQUAL_SIGN + value;
    })
    .join(AND_SIGN);
}

function useFilter(formData) {
  console.log(formData);

  const location = useLocation();
  const navigate = useNavigate();

  // substring(1) for remove '?' from the beginning of the url
  const search = location.search.substring(1);

  const filterState = parseUrl(search);

  const onChangeMap = {
    [FormType.TEXT]: (e, name, state) => {
      const value = e.target.value;

      if (!value) {
        onClear(name);
      } else {
        state[name] = decodeURIComponent(value);
      }
    },
    [FormType.DROPDOWN]: (e, name, state) => {
      const value = e.target.value;
      state[name] = value;
      clearChildrenField(name);
    },
    [FormType.TEXTAREA]: (e, name, state) => {
      const value = e.target.value;

      if (!value) {
        onClear(name);
      } else {
        state[name] = decodeURIComponent(value);
      }
    },
    [FormType.CHECKBOX]: (e, name, state) => {
      const value = e.target.value;

      if (state[name]) {
        onClear(name);
      } else {
        state[name] = value;
      }
    },
    [FormType.CHECKBOX_GROUP]: (e, name, state) => {
      const value = e.target.value;

      if (state[name]) {
        const oldValue = state[name];
        const arr = oldValue.split(ARRAY_SEPARATOR);

        if (arr.includes(value)) {
          state[name] = arr.filter((v) => v !== value).join(ARRAY_SEPARATOR);

          if (arr.length === 1) onClear(name);
        } else {
          state[name] += ARRAY_SEPARATOR + value;
        }
      } else state[name] = value;
    },
    // TODO: We Need debounce on chnage range
    [FormType.RANGE]: (e, name, state) => {
      const value = e.target.value;

      state[name] = value;
    },
  };

  const setFilterState = useCallback(
    (state) => {
      const query = stringifyUrl(state);
      navigate(query ? `?${query}` : location.pathname, { replace: true });
    },
    [navigate, location.pathname]
  );

  const onChange = useCallback(
    (e, name, type) => {
      if (!onChangeMap[type]) throw new Error("Invalid type");

      onChangeMap[type](e, name, filterState);
      setFilterState(filterState);
    },
    [filterState, setFilterState]
  );

  const clearChildrenField = (name) => {
    const fieldData = formData.find((f) => f.name === name);

    if (fieldData.children && fieldData.children.length > 0) {
      fieldData.children.forEach((child) => {
        delete filterState[child];
      });
    }
  };

  const clearField = (name) => {
    delete filterState[name];
  };

  const onClear = useCallback(
    (name) => {
      clearChildrenField(name);
      clearField(name);

      setFilterState(filterState);
    },
    [filterState, setFilterState]
  );

  const onClearAll = useCallback(() => {
    navigate(location.pathname, { replace: true });
  }, [navigate, location.pathname]);

  return { filterState, setFilterState, onChange, onClear, onClearAll };
}

export default useFilter;

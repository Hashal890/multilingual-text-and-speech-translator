import React from "react";
import data from "../assets/data.json";

const LanguagesSelect = () => {
  return (
    <>
      {Object.keys(data.languages).map((key) => (
        <option key={key} value={key}>
          {data.languages[key]}
        </option>
      ))}
    </>
  );
};

export default LanguagesSelect;

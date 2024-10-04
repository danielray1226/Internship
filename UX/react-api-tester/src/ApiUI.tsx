import ApiCallResults from "./components/ApiCallResults";
import ApiPathSelector from "./components/ApiPathSelector";
import ParametersSelector from "./components/ParametersSelector";
import PathSelector from "./components/PathSelector";
import { getAPICallerUrl } from "./consts";
import { useEffect, useState } from "react";

function apiCaller(body: Object) {
  const b = JSON.stringify(body);
  console.log("SUBMITTING " + b);
  const url = getAPICallerUrl();
  console.log(getAPICallerUrl());
  fetch(url, {
    method: "POST",
    credentials: "include",
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
    body: b,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("FETCH GOT US: " + JSON.stringify(data));
    })
    .catch((e) => {
      console.log(e);
    });
}

function ApiUI() {
  const [currentPath, setPath] = useState("/");
  function pathSelected(heading: string, index: number, path: string) {
    console.log(path);
    setPath(path);
  }
  useEffect(() => {
    apiCaller({ Hello: "world" });
  });
  return (
    <>
      <ApiPathSelector onSelectItem={pathSelected} />
      <br />
      <PathSelector path={currentPath} />
      <br />
      <ApiCallResults />
    </>
  );
}

export default ApiUI;

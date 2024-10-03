import ApiCallResults from "./components/ApiCallResults";
import ApiPathSelector from "./components/ApiPathSelector";
import ParametersSelector from "./components/ParametersSelector";
import PathSelector from "./components/PathSelector";
import { useState } from "react";

function ApiUI() {
  const [currentPath, setPath] = useState("/");
  function pathSelected(heading: string, index: number, path: string) {
    console.log(path);
    setPath(path);
  }

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

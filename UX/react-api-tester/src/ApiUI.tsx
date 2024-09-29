import ApiCallResults from "./components/ApiCallResults";
import ApiPathSelector from "./components/ApiPathSelector";
import ParametersSelector from "./components/ParametersSelector";

function ApiUI() {
  return (
    <>
      <ApiPathSelector/>
      <br/>
      <ParametersSelector/>
      <br/>
      <ApiCallResults/>
    </>
  );
}

export default ApiUI;
import ListGroup from "./components/ListGroup";
import MyButton from "./components/MyButton";
import { callApi, loadOpenApi } from "./consts";
import { useEffect, useState } from "react";
import Parameters from "./Parameters";

function ApiUI() {
  const [openApi, setOpenApi] = useState();
  const [openApiError, setOpenApiError] = useState();
  const [currentPath, setPath] = useState();
  const [httpMethod, setHttpMethod] = useState();
  const [apiServerUrl, setApiServerUrl] = useState();
  const [paramsValid, setParamsValid] = useState(true);
  const [parameters, setParameters] = useState({});
  const [serverCallResult, setServerCallResult] = useState();
  const [serverCallError, setServerCallError] = useState();
  const [serverIsCalled, setServerIsCalled] = useState(false);

  function onPathSelected(heading: string, i: number, path: string) {
    setPath(path);
    setHttpMethod(null);
    setParameters({});
    setServerCallResult(null);
    setServerCallError(null);
    setServerIsCalled(false);
  }
  function onHttpMethodSelected(heading: string, i: number, method: string) {
    console.log("METHOD SELECTED!!!!", method);
    setHttpMethod(method);
    setParameters({});
    setServerIsCalled(false);
    setServerIsCalled(false);
    setServerCallError(null);
    setServerCallResult(null);
  }
  function onServerUrlSelected(heading: string, i: number, url: string) {
    setApiServerUrl(url);
    setServerIsCalled(false);
  }

  function onOpenApiLoaded(data: Object) {
    setOpenApi(data);
  }
  function onOpenApiError(ex: any) {
    setOpenApiError(ex);
  }
  function onParamsChange(valid: boolean, parameters: Object) {
    //console.log("On Parameter Change: is valid: ", valid, ", got parameters as: ", parameters);
    setParamsValid(valid);
    setParameters(parameters);
  }

  useEffect(() => {
    loadOpenApi(onOpenApiLoaded, onOpenApiError);
  }, []);

  console.log("Error: ", openApiError);

  if (openApiError)
    return <p>Error loading open api: {openApiError.message}</p>;
  if (!openApi) return <p>Loaded Empty OpenAPI...</p>;

  // we got open api, lets find out all the paths
  const pathsObject = openApi["paths"];
  const pathNames = Object.keys(pathsObject);
  if (!pathNames || pathNames.length === 0)
    return <p>Error: OpenAPI did not provide any paths </p>;

  console.log("PATH NAMES: ", pathNames);

  let myPath = currentPath ? currentPath : pathNames[0];
  const pathObject = pathsObject[myPath]; // Object which has get/post.. properties
  // lets find out, what are the http methods
  const httpMethods = Object.keys(pathObject);
  console.log("HTTP METHODS: ", httpMethods);
  let myHttpMethod = httpMethod ? httpMethod : httpMethods[0];

  const methodObject = pathObject[myHttpMethod];
  const methodObjectDescription = methodObject["description"];
  const methodObjectParameters = methodObject["parameters"];
  console.log("Description: ", methodObjectDescription);
  console.log("Parameter Definitions: ", methodObjectParameters);

  console.log("WILL USE HTTP METHOD: ", myHttpMethod);

  let serversArray = openApi["servers"];
  let serverUrls = [];
  for (const s of serversArray) {
    serverUrls.push(s["url"]);
  }
  console.log("SERVER URLS: ", serverUrls);
  const myServerUrl = apiServerUrl
    ? apiServerUrl
    : serverUrls.length > 0
    ? serverUrls[0]
    : null;
  console.log("Will use url: " + myServerUrl);

  function onApiServerCallResult(data: Object) {
    setServerCallResult(data);
    setServerIsCalled(false);
    setServerCallError(null);
  }
  function onApiServerCallError(ex) {
    setServerCallResult(null);
    setServerIsCalled(false);
    setServerCallError(ex);
  }

  function callServerUrl() {
    setServerIsCalled(true);
    setServerCallError(null);
    setServerCallResult(null);
    callApi(
      onApiServerCallResult /* onData?: (data: Object) => void,*/,
      onApiServerCallError, //onError?: (ex) => void,
      myServerUrl,
      myPath,
      myHttpMethod,
      parameters
    );
  }

  return (
    <>
      <div className="container">
        <ListGroup
          items={pathNames}
          onSelectItem={onPathSelected}
          heading="OpenAPI Paths"
          defaultSelection={0}
        />
      </div>
      {httpMethods.length > 0 && (
        <>
          <br />
          <div className="container">
            <ListGroup
              key={"http_method_for-" + myPath}
              items={httpMethods}
              onSelectItem={onHttpMethodSelected}
              heading="HTTP Method"
              defaultSelection={0}
            />
            <>{methodObjectDescription}</>
          </div>
        </>
      )}
      {serverUrls.length > 0 && (
        <>
          {methodObjectParameters && (
            <>
              <br />
              <div className="container">
                <Parameters
                  key={"params-" + myPath + "-" + myHttpMethod}
                  params={methodObjectParameters}
                  onParamsChange={onParamsChange}
                />
              </div>
            </>
          )}
          <div className="container">
            <ListGroup
              items={serverUrls}
              onSelectItem={onServerUrlSelected}
              heading="Server URLs"
              defaultSelection={0}
            />
          </div>
          {myHttpMethod &&
            (methodObjectParameters === undefined || paramsValid) && (
              <>
                <br />
                <div className="container">
                  <MyButton
                    color="danger"
                    onClick={callServerUrl}
                    disabled={serverIsCalled}
                  >
                    Call {myServerUrl}
                  </MyButton>
                </div>
              </>
            )}
        </>
      )}
      {serverIsCalled && (
        <>
          <br />
          <div className="container">
            <ul className="list-group">
              <li className="list-group-item">Calling {myServerUrl}</li>
              <li className="list-group-item">Path {myPath}</li>
              <li className="list-group-item">Method {myHttpMethod}</li>
              <li className="list-group-item">
                With parameters {JSON.stringify(parameters)}
              </li>
            </ul>
          </div>
        </>
      )}
      {serverCallResult && (
        <>
          <br />
          <div className="container">{JSON.stringify(serverCallResult)}</div>
        </>
      )}
      {serverCallError && (
        <>
          <br />
          <div className="container">{serverCallError.message}</div>
        </>
      )}
    </>
  );
}
//<PathSelector path={myPath} />
export default ApiUI;

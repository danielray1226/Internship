import { useEffect, useState } from "react";
import RenderResults from "./RenderResults";
interface Props {
  result: Object;
  openApi: Object;
  path: String;
  httpMethod: String;
}
/*const pathsObject = openApi["paths"];
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
*/
function extractPropertiesByRef(openApi: Object, ref: string) {
  const reference = ref.substring(2);
  const splitted = reference.split("/");
  console.log("Reference: ", reference);
  console.log("Stringified: ", JSON.stringify(splitted));
  let currentObject = openApi;
  for (let index = 0; index < splitted.length; index++) {
    const nameOfIndex = splitted[index];
    let newObj = currentObject[nameOfIndex];
    if (!newObj) {
      return undefined;
    }
    console.log(splitted[index]);
    currentObject = newObj;
  }
  console.log("Farthest Object: ", JSON.stringify(currentObject));
  return currentObject["properties"];
}
export default function ServerResults({
  result,
  openApi,
  path,
  httpMethod,
}: Props) {
  const pathsObject = openApi["paths"];
  const pathObject = pathsObject[path];
  const methodObject = pathObject[httpMethod];
  const methodObjectResponses = methodObject["responses"];
  const statusCode = "" + result["statusCode"];
  const content = methodObjectResponses[statusCode].content;
  let schema;
  for (const [key, value] of Object.entries(content)) {
    console.log(`${key}: ${value}`);
    schema = value["schema"];
    break;
  }

  if (!schema) return <></>;
  const ref = schema["$ref"];
  console.log(JSON.stringify(schema));
  console.log(ref);
  console.log("CONTENT: " + JSON.stringify(content));
  const properties = extractPropertiesByRef(openApi, ref);
  console.log("Properties: ", JSON.stringify(properties));
  console.log(methodObjectResponses);
  return (
    <>
      <div>
        {Object.keys(properties).map((key) => (
          <RenderResults
            key={key}
            property={key}
            def={properties[key]}
            data={result["data"]}
            openApi={openApi}
          />
        ))}
      </div>
    </>
  );
}

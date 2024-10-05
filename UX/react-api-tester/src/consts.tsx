export function getLoginUrl() {
  console.log("MODE: " + import.meta.env.MODE);
  console.log("BASE_URL: " + import.meta.env.BASE_URL);
  console.log("DEV: " + import.meta.env.DEV);
  console.log("PROD: " + import.meta.env.PROD);
  if (import.meta.env.MODE != "development") return "/login";
  return "http://localhost:8000/login";
}
export function getAPICallerUrl() {
  if (import.meta.env.MODE != "development") return "/APICaller";
  return "http://localhost:8000/APICaller";
}

export function getOpenAPIDataUrl() {
  if (import.meta.env.MODE != "development") return "/OpenApiData";
  return "http://localhost:8000/OpenApiData";
}

export function getLogoffUrl() {
  if (import.meta.env.MODE != "development") return "/logoff";
  return "http://localhost:8000/logoff";
}

export function isDev() {
  return import.meta.env.MODE == "development";
}

export function loadOpenApi(
  onData?: (openApi: Object) => void,
  onError?: (ex) => void
) {
  const url = getOpenAPIDataUrl();
  console.log("Calling: ", url);
  fetch(url, {
    method: "GET",
    credentials: "include",
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (onData) onData(data);
    })
    .catch((e) => {
      if (onError) onError(e);
    });
}

export function callApi(
  onData?: (data: Object) => void,
  onError?: (ex) => void,
  serverUrl: string,
  path: string,
  method: string,
  paramValues: Object
) {
  /*
			tomcat will expect following json object, e.g.:
			{
				"path" : "/artifact-fields/{field-id}/options",
				"method" : "get",
				"parameters" : [
					{
						"name": "field-id",
						"value" : 123
					}, 
					{
						"name": "project",
						"value": "FooBar"
					}
				],
				"body" : "POST body as a string or json"
			}
  */
  let body = {
    serverUrl: serverUrl,
    path: path,
    method: method,
    parameters: [],
  };
  for (const [key, value] of Object.entries(paramValues)) {
    body.parameters.push({ name: key, value: value });
  }
  const b = JSON.stringify(body);
  const url = getAPICallerUrl();
  console.log("Calling: ", url, ", with payload: ", b);
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
      if (onData) onData(data);
    })
    .catch((e) => {
      console.log(e);
      if (onError) onError(e);
    });
}

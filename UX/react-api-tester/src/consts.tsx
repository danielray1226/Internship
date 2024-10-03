export function getLoginUrl() {
  console.log("MODE: " + import.meta.env.MODE);
  console.log("BASE_URL: " + import.meta.env.BASE_URL);
  console.log("DEV: " + import.meta.env.DEV);
  console.log("PROD: " + import.meta.env.PROD);
  if (import.meta.env.MODE != "development") return "/login";
  return "http://localhost:8000/login";
}

export function getLogoffUrl() {
  console.log("MODE: " + import.meta.env.MODE);
  console.log("BASE_URL: " + import.meta.env.BASE_URL);
  console.log("DEV: " + import.meta.env.DEV);
  console.log("PROD: " + import.meta.env.PROD);
  if (import.meta.env.MODE != "development") return "/logoff";
  return "http://localhost:8000/logoff";
}
export function isDev() {
  return import.meta.env.MODE == "development";
}

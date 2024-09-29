import ListGroup from "./ListGroup";

const items1 = [
    "/",
    "/artifact-fields",
    "/artifact-fields/{field-id}/options",
    "/artifact-types",
    "/artifacts",
    "/artifacts/{id}",
    "/capabilities",
    "/projects",
];

function ApiPathSelector() {
 return (
    <>
      <label>Path Selector</label>
      <ListGroup
        items={items1}
        heading="OpenAPI Paths"
      />
    </>
 );
}
export default ApiPathSelector;
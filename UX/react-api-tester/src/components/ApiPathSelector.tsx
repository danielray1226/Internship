import ListGroup from "./ListGroup";
import PathSelector from "./PathSelector";
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
interface Props {
  onSelectItem?: (heading: string, index: number, item: string) => void;
}
function ApiPathSelector({ onSelectItem }: Props) {
  return (
    <>
      <label>Path Selector</label>
      <ListGroup
        items={items1}
        onSelectItem={onSelectItem}
        heading="OpenAPI Paths"
      />
    </>
  );
}
export default ApiPathSelector;

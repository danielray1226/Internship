import ArtifactFields from "./Paths/ArtifactFields";
import ArtifactsWithID from "./Paths/ArtifactsWithID";
import Root from "./Paths/Root";
const AllPaths = {
  "/": Root,
  "/artifact-fields": ArtifactFields,
  "/artifact-fields/{field-id}/options": ArtifactsWithID,
};

interface Props {
  path: string;
}
function PathSelector({ path }: Props) {
  const Current = AllPaths[path];
  return <Current />;
}
export default PathSelector;

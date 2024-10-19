import TableWithClickableRow from "./TableWithClickableRow";

interface Props {
  property: string;
  def: Object;
  data: Object;
  openApi: Object;
}

export default function RenderResults({ property, def, data, openApi }: Props) {
  let headers = ["id", "label", "c3", "c4"];
  let rows = [
    { id: "hi", label: "there" },
    { id: "hi again" },
    { id: "hi one more time", label: "Blah", c4: "there one more time" },
  ];
  function onData(data: Object) {
    console.log("Data is: " + JSON.stringify(data));
  }

  return (
    <>
      <TableWithClickableRow
        name="Hello table"
        headers={headers}
        rows={rows}
        onRowClicked={onData}
      />
      <TableWithClickableRow
        name="next_cursor"
        headers={["next_cursor"]}
        rows={[{ next_cursor: "bzzzz" }]}
        onRowClicked={onData}
      />
    </>
  );
  /*return (
    <div>
      Property: {property}
      <br />
      <br />
      Def: {JSON.stringify(def)}
      <br />
      <br />
      Data: {JSON.stringify(data)}
      <br />
      <br />
    </div>
  );*/
}

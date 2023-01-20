import { Box, FormField, Heading, Select } from "grommet";
import { atom, useAtom } from "jotai";

import { RegionNode } from "../utils/types";

type Props = {
  title: string;
  regions: Array<Array<RegionNode>>;
  labels: Array<string>;
  onChange: (update: Array<RegionNode>) => void;
};

export const selectionAtom = atom<Array<RegionNode>>([]);

export default function RegionInfoSelector({
  title,
  regions,
  labels,
  onChange,
}: Props) {
  const [currentSelection, setSelection] = useAtom(selectionAtom);

  if (!currentSelection) setSelection([]);

  const updateSelection = (idx: number, node: RegionNode) => {
    // clear selections to the right of current selection idx
    if (idx < currentSelection.length - 1) {
      for (let step = currentSelection.length - 1; step > idx; step--) {
        currentSelection.pop();
      }
    }

    if (node) currentSelection[idx] = node;
    else currentSelection.pop(); // when current select is cleared

    setSelection([...currentSelection]);
    onChange(currentSelection);
  };

  function filterNodes(
    idx: number,
    nodes: Array<RegionNode>
  ): Array<RegionNode> {
    if (idx <= 0) return nodes;
    if (idx > 0 && currentSelection && currentSelection.length >= idx) {
      const parentRegion = currentSelection[idx - 1];
      return nodes.filter((node) => node.parentId === parentRegion?.id);
    }
    return [];
  }

  return (
    <Box direction="column">
      <Heading level={4} margin={{ vertical: "xsmall" }}>
        {title}
      </Heading>
      <Box direction="row">
        {regions.map((nodes, idx) => {
          const selectId = title + "_" + labels[idx] + "_selectId_" + idx;
          const selectName = title + "_" + labels[idx] + "_selectName_" + idx;
          return (
            <FormField key={idx} htmlFor={selectId} label={labels[idx]}>
              <Select
                id={selectId}
                name={selectName}
                valueKey="id"
                labelKey="name"
                options={filterNodes(idx, nodes)}
                value={currentSelection ? currentSelection[idx] : undefined}
                onChange={(event) => updateSelection(idx, event.value)}
                clear={{ position: "top", label: "Clear" }}
                placeholder="Select ..."
              />
            </FormField>
          );
        })}
      </Box>
    </Box>
  );
}

import { SheetDefinition, SheetRegister } from "react-native-actions-sheet";
import { FilterSheet } from "./components/Transactions/FilterSheet";
import { FilterState } from "./components/Transactions/FilterModal";
import { MultiSelectSheet } from "./components/ui/MultiSelectSheet";

declare module "react-native-actions-sheet" {
  interface Sheets {
    "filter-sheet": SheetDefinition<{
      payload: {
        initialFilters: FilterState;
      };
      returnValue: FilterState | undefined;
    }>;
    "multi-select-sheet": SheetDefinition<{
      payload: {
        title: string;
        items: Array<{
          id: string;
          name: string;
          color: string;
          icon?: string;
          iconFamily?: string;
          group?: string;
        }>;
        selectedIds: string[];
        onSelect: (ids: string[]) => void;
      };
    }>;
  }
}

export const Sheets = () => {
  return (
    <SheetRegister
      sheets={{
        "filter-sheet": FilterSheet,
        "multi-select-sheet": MultiSelectSheet,
      }}
    />
  );
};

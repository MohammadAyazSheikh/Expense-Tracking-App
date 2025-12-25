import {
  RouteDefinition,
  SheetDefinition,
  SheetRegister,
} from "react-native-actions-sheet";

import FilterSheetWithRouter, {
  FilterState,
} from "./components/Transactions/filterSheet/FilterSheet";
import {
  ExpenseCategorySheet,
  ExpenseTagSheet,
} from "./components/Transactions/ExpenseActionSheets";

declare module "react-native-actions-sheet" {
  interface Sheets {
    "filter-sheet": SheetDefinition<{
      payload: { initialFilters: FilterState };
      returnValue: FilterState | undefined;
      routes: {
        main: RouteDefinition<{
          initialFilters: FilterState;
          fromSheet: "category" | "tag";
          selectedTagIds: string[];
          selectedCatIds: string[];
        }>;
        "tags-select-sheet": RouteDefinition<{
          selectedIds: string[];
        }>;
        "category-select-sheet": RouteDefinition<{
          selectedIds: string[];
        }>;
      };
    }>;
    "expense-category-sheet": SheetDefinition<{
      payload: { selectedId?: string };
      returnValue: string | undefined;
    }>;
    "expense-tag-sheet": SheetDefinition<{
      payload: { selectedIds: string[] };
      returnValue: string[] | undefined;
    }>;
  }
}

export const Sheets = () => {
  return (
    <SheetRegister
      sheets={{
        "filter-sheet": FilterSheetWithRouter,
        "expense-category-sheet": ExpenseCategorySheet,
        "expense-tag-sheet": ExpenseTagSheet,
      }}
    />
  );
};

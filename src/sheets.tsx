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
import { DatePickerSheet } from "./components/sheets/DatePickerSheet";
import { WalletSelectorSheet } from "./components/Wallets/WalletSelectorSheet";
import { MenuSheet, MenuItem } from "./components/sheets/MenuSheet";
import { SelectSheet, SelectorOption } from "./components/sheets/SelectSheet";

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
    "date-picker-sheet": SheetDefinition<{
      payload: { date?: string };
      returnValue: string | undefined;
    }>;
    "wallet-selector-sheet": SheetDefinition<{
      payload: {
        excludeId?: string;
        title?: string;
      };
      returnValue: string | undefined;
    }>;
    "menu-sheet": SheetDefinition<{
      payload: { options: MenuItem[]; title?: string };
      returnValue: boolean | undefined;
    }>;
    "select-sheet": SheetDefinition<{
      payload: {
        options: SelectorOption[];
        title?: string;
        selectedValue?: string;
        onSelect?: (value: string) => void;
      };
      returnValue: string | undefined;
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
        "date-picker-sheet": DatePickerSheet,
        "wallet-selector-sheet": WalletSelectorSheet,
        "menu-sheet": MenuSheet,
        "select-sheet": SelectSheet,
      }}
    />
  );
};

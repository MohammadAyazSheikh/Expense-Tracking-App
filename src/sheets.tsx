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
import { TransferSheet } from "./components/Wallets/TransferSheet";
import { MenuSheet, MenuItem } from "./components/sheets/MenuSheet";
import {
  GenericSelectSheet,
  SelectorOption,
} from "./components/sheets/GenericSelectSheet";

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
    "transfer-sheet": SheetDefinition<{
      payload?: { fromWalletId?: string; toWalletId?: string };
      returnValue: boolean | undefined;
      routes: {
        main: RouteDefinition<{
          selectedWalletId?: string;
          mode?: "from" | "to";
        }>;
        "wallet-selector": RouteDefinition<{
          mode: "from" | "to";
          excludeId?: string | null;
        }>;
      };
    }>;
    "menu-sheet": SheetDefinition<{
      payload: { options: MenuItem[]; title?: string };
      returnValue: boolean | undefined;
    }>;
    "generic-select-sheet": SheetDefinition<{
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
        "transfer-sheet": TransferSheet,
        "menu-sheet": MenuSheet,
        "generic-select-sheet": GenericSelectSheet,
      }}
    />
  );
};

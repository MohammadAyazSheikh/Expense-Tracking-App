import {
  RouteDefinition,
  SheetDefinition,
  SheetRegister,
} from "react-native-actions-sheet";

import FilterSheetWithRouter, {
  FilterState,
} from "./components/transactions/filterSheet/FilterSheet";
import {
  ExpenseCategorySheet,
  ExpenseTagSheet,
} from "./components/transactions/ExpenseActionSheets";
import { DatePickerSheet } from "./components/sheets/DatePickerSheet";
import { WalletSelectorSheet } from "./components/Wallets/WalletSelectorSheet";
import { MenuSheet, MenuItem } from "./components/sheets/MenuSheet";
import { SelectSheet, SelectorOption } from "./components/sheets/SelectSheet";
import {
  MultiSelectSheet,
  MultiSelectOption,
} from "./components/sheets/MultiSelectSheet";
import { AddFriendSheet } from "./components/friends/AddFriendSheet";
import { RecordPaymentSheet } from "./components/groups/RecordPaymentSheet";
import { CategorySheet } from "./components/sheets/CategorySheet";
import { TagSheet } from "./components/sheets/TagSheet";
import { ColorPickerSheet } from "./components/sheets/ColorPickerSheet";
import { Category, Tag } from "./types";

declare module "react-native-actions-sheet" {
  interface Sheets {
    "add-friend-sheet": SheetDefinition<{
      payload: undefined;
    }>;
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
    "multi-select-sheet": SheetDefinition<{
      payload: {
        options: MultiSelectOption[];
        title?: string;
        selectedValues?: string[];
      };
      returnValue: string[] | undefined;
    }>;
    "record-payment-sheet": SheetDefinition<{
      payload: {
        settlement: {
          id: string;
          from: string;
          to: string;
          amount: number;
          groupName?: string;
        };
        onConfirm: (amount: number, method: string) => void;
      };
    }>;
    "manage-category-sheet": SheetDefinition<{
      payload: {
        category?: Category;
        type?: "income" | "expense";
      };
      routes: {
        "add-update-category": RouteDefinition;
        "system-category-picker": RouteDefinition;
      };
    }>;
    "tag-sheet": SheetDefinition<{
      payload: {
        tag?: Tag;
      };
    }>;
    "color-picker-sheet": SheetDefinition<{
      payload: {
        selectedColor?: string;
        title?: string;
        onSelect?: (color: string) => void;
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
        "multi-select-sheet": MultiSelectSheet,
        "add-friend-sheet": AddFriendSheet,
        "record-payment-sheet": RecordPaymentSheet,
        "manage-category-sheet": CategorySheet,
        "tag-sheet": TagSheet,
        "color-picker-sheet": ColorPickerSheet,
      }}
    />
  );
};

import React, { useState, useMemo } from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Calendar, DateData } from "react-native-calendars";
import { Text } from "../ui/Text";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import moment from "moment";

type ViewMode = "calendar" | "month" | "year";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DatePickerSheet = (props: SheetProps<"date-picker-sheet">) => {
  const { theme } = useUnistyles();
  const initialDate = props.payload?.date
    ? moment(props.payload.date)
    : moment();

  const [currentDate, setCurrentDate] = useState(initialDate);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [yearOffset, setYearOffset] = useState(0); // For pagination in year view

  const handleDayPress = (day: DateData) => {
    SheetManager.hide(props.sheetId, { payload: day.dateString });
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = currentDate.clone().month(monthIndex);
    setCurrentDate(newDate);
    setViewMode("calendar");
  };

  const handleYearSelect = (year: number) => {
    const newDate = currentDate.clone().year(year);
    setCurrentDate(newDate);
    setViewMode("calendar"); // Or 'month' if prefer drilling down
  };

  const years = useMemo(() => {
    const currentYear = moment().year();
    const startYear = currentYear - 10 + yearOffset;
    return Array.from({ length: 20 }, (_, i) => startYear + i);
  }, [yearOffset]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerTitleContainer}
        onPress={() =>
          setViewMode(viewMode === "calendar" ? "year" : "calendar")
        }
      >
        <Text variant="h3">
          {viewMode === "year"
            ? "Select Year"
            : viewMode === "month"
            ? "Select Month"
            : currentDate.format("MMMM YYYY")}
        </Text>
        <Icon
          type="Feather"
          name={viewMode === "calendar" ? "chevron-down" : "chevron-up"}
          size={20}
          color={theme.colors.foreground}
        />
      </TouchableOpacity>

      {viewMode === "calendar" && (
        <View style={styles.headerControls}>
          <TouchableOpacity
            onPress={() =>
              setCurrentDate(currentDate.clone().subtract(1, "month"))
            }
          >
            <Icon
              type="Feather"
              name="chevron-left"
              size={24}
              color={theme.colors.foreground}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrentDate(currentDate.clone().add(1, "month"))}
          >
            <Icon
              type="Feather"
              name="chevron-right"
              size={24}
              color={theme.colors.foreground}
            />
          </TouchableOpacity>
        </View>
      )}

      {viewMode === "year" && (
        <View style={styles.headerControls}>
          <TouchableOpacity onPress={() => setYearOffset((prev) => prev - 20)}>
            <Icon
              type="Feather"
              name="chevrons-left"
              size={24}
              color={theme.colors.foreground}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setYearOffset((prev) => prev + 20)}>
            <Icon
              type="Feather"
              name="chevrons-right"
              size={24}
              color={theme.colors.foreground}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const selectedDateString = useMemo(() => {
    return props.payload?.date || moment().format("YYYY-MM-DD");
  }, [props.payload?.date]);

  const markedDates = useMemo(
    () => ({
      [moment(selectedDateString).format("YYYY-MM-DD")]: {
        selected: true,
        selectedColor: theme.colors.primary,
        selectedTextColor: "#ffffff",
      },
    }),
    [selectedDateString, theme.colors.primary]
  );

  const renderCalendar = () => (
    <Calendar
      current={currentDate.format("YYYY-MM-DD")}
      onDayPress={handleDayPress}
      enableSwipeMonths={true}
      hideArrows={true} // Custom header handles arrows
      renderHeader={() => null} // Custom header
      markedDates={markedDates}
      theme={{
        backgroundColor: theme.colors.background,
        calendarBackground: theme.colors.background,
        textSectionTitleColor: theme.colors.mutedForeground,
        selectedDayBackgroundColor: theme.colors.primary,
        selectedDayTextColor: "#ffffff",
        todayTextColor: theme.colors.primary,
        dayTextColor: theme.colors.foreground,
        textDisabledColor: theme.colors.muted,
        monthTextColor: theme.colors.foreground,
        arrowColor: theme.colors.primary,
        textDayFontWeight: "400",
        textMonthFontWeight: "bold",
        textDayHeaderFontWeight: "600",
        textDayFontSize: 16,
        textMonthFontSize: 18,
        textDayHeaderFontSize: 14,
      }}
      key={currentDate.format("YYYY-MM")} // Force re-render on month change
    />
  );

  const renderMonthPicker = () => (
    <View style={styles.gridContainer}>
      {MONTHS.map((month, index) => (
        <TouchableOpacity
          key={month}
          style={[
            styles.gridItem,
            currentDate.month() === index && styles.selectedGridItem,
          ]}
          onPress={() => handleMonthSelect(index)}
        >
          <Text
            style={[
              styles.gridText,
              currentDate.month() === index && styles.selectedGridText,
            ]}
          >
            {month.substring(0, 3)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderYearPicker = () => (
    <FlatList
      data={years}
      keyExtractor={(item) => item.toString()}
      numColumns={4}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.gridItem,
            currentDate.year() === item && styles.selectedGridItem,
          ]}
          onPress={() => handleYearSelect(item)}
        >
          <Text
            style={[
              styles.gridText,
              currentDate.year() === item && styles.selectedGridText,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={styles.container}
      indicatorStyle={styles.indicator}
      gestureEnabled
    >
      <View style={styles.content}>
        {renderHeader()}

        <View style={styles.body}>
          {viewMode === "calendar" && renderCalendar()}
          {viewMode === "month" && renderMonthPicker()}
          {viewMode === "year" && renderYearPicker()}
        </View>

        {/* Quick Switch for Month/Year in Calendar Mode */}
        {viewMode === "calendar" && (
          <View style={styles.footer}>
            <Button
              title={currentDate.format("MMMM")}
              variant="outline"
              size="sm"
              onPress={() => setViewMode("month")}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title={currentDate.format("YYYY")}
              variant="outline"
              size="sm"
              onPress={() => setViewMode("year")}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        )}
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create((theme: any) => ({
  container: {
    backgroundColor: theme.colors.background,
    borderTopEndRadius: theme.radius.xl,
    borderTopStartRadius: theme.radius.xl,
    paddingBottom: theme.paddings.xl,
  },
  indicator: {
    backgroundColor: theme.colors.border,
    width: 40,
    marginTop: 8,
  },
  content: {
    padding: theme.paddings.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.margins.md,
    paddingHorizontal: theme.paddings.xs,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerControls: {
    flexDirection: "row",
    gap: 16,
  },
  body: {
    minHeight: 350,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: theme.margins.md,
  },
  listContainer: {
    paddingBottom: theme.paddings.md,
  },
  gridItem: {
    width: "23%",
    aspectRatio: 1.5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.md,
    marginBottom: theme.margins.md,
    backgroundColor: theme.colors.card,
    marginHorizontal: "1%",
  },
  selectedGridItem: {
    backgroundColor: theme.colors.primary,
  },
  gridText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.foreground,
    fontWeight: "500",
  },
  selectedGridText: {
    color: "white",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    marginTop: theme.margins.md,
  },
}));

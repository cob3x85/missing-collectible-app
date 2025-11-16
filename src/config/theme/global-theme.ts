import {StyleSheet} from 'react-native';

export const globalThemeStyles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  headerImageContainer: {
    alignContent: "center",
    flex: 1,
    height: 178,
    justifyContent: "center",
    width: "100%",
  },
  flatList: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  flatListContent: {
    padding: 15,
  },
  row: {
    justifyContent: "space-between",
  },
});
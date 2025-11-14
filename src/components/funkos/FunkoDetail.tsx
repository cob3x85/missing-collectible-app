import { View, Text, StyleSheet } from 'react-native';
import { ThemedText } from '../themed-text';

export const FunkoDetail = () => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>Component</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

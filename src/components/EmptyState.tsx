import { View, Text, StyleSheet } from "react-native";

const EmptyState = () => {
  return (
    <View>
      <Text style={styles.message}>No products found.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    fontSize: 16,
    marginTop: 10,
  },
});
export default EmptyState;

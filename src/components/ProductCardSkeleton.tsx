import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    backgroundColor: "#e0e0e0",
  },

  title: {
    width: 180,
    height: 16,
    backgroundColor: "#e0e0e0",
  },

  price: {
    width: 80,
    height: 16,
    alignSelf: "flex-end",
    backgroundColor: "#e0e0e0",
  },
});

const ProductCardSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.image} />
      <View style={styles.title} />
      <View style={styles.price} />
    </View>
  );
};

export default ProductCardSkeleton;

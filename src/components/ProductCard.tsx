import { Product } from "../types/Product";
import { StyleSheet, Text, View, Image } from "react-native";

interface ProductCardProps {
  product: Product;
}

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
  },

  title: {
    fontSize: 16,
    marginTop: 10,
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-end",
    marginTop: 8,
  },
});

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.thumbnail }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>RM {product.price}</Text>
    </View>
  );
};

export default ProductCard;

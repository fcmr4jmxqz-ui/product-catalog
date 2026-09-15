import { Product } from "../types/Product";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useState } from "react";
interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const [imageError, setImageError] = useState<boolean>(false);
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {imageError ? (
        <View style={styles.imagePlaceholder}>
          <Text>No image</Text>
        </View>
      ) : (
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.thumbnail}
          onError={() => {
            setImageError(true);
          }}
        />
      )}
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>RM {product.price}</Text>
    </Pressable>
  );
};

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

  thumbnail: {
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

  imagePlaceholder: {
    width: 100,
    height: 100,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
  },
});
export default ProductCard;

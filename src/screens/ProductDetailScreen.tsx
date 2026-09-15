import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  Text,
  Pressable,
} from "react-native";
import { getProductById } from "../api/ProductApi";
import { Product } from "../types/Product";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

type ProductDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ProductDetail"
>;

const ProductDetailScreen = ({ route }: ProductDetailScreenProps) => {
  const productId = route.params.productId;
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProductDetail() {
      try {
        setLoading(true);
        setError(null);

        const data = await getProductById(productId);

        setProduct(data);
      } catch (error) {
        setError("Failed to load product, please retry");
      } finally {
        setLoading(false);
      }
    }

    loadProductDetail();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text>Loading product...</Text>
      </View>
    );
  }

  if (error !== null) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (product === null) {
    return (
      <View style={styles.container}>
        <Text>Product not found.</Text>
      </View>
    );
  }
  const galleryImages = product.images;

  return (
    <View style={styles.container}>
      <Text>
        Image {currentImageIndex + 1} of {galleryImages.length}
      </Text>

      <View style={styles.mainImageContainer}>
        {imageLoading && <ActivityIndicator size="large" />}
        <Pressable
          style={styles.leftArrow}
          onPress={() => {
            setImageError(false);
            if (currentImageIndex > 0) {
              setCurrentImageIndex(currentImageIndex - 1);
            }
          }}
        >
          <Text style={styles.arrowText}>{"<"}</Text>
        </Pressable>
        {imageError ? (
          <View style={styles.imagePlaceholder}>
            <Text>No image</Text>
          </View>
        ) : (
          <Image
            source={{ uri: galleryImages[currentImageIndex] }}
            style={[styles.mainImage, imageLoading && styles.hiddenImage]}
            onLoadStart={() => {
              setImageLoading(true);
            }}
            onLoadEnd={() => {
              setImageLoading(false);
            }}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        )}
        <Pressable
          style={styles.rightArrow}
          onPress={() => {
            setImageError(false);
            if (currentImageIndex < galleryImages.length - 1) {
              setCurrentImageIndex(currentImageIndex + 1);
            }
          }}
        >
          <Text style={styles.arrowText}>{">"}</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>{product.title}</Text>

      <Text style={styles.price}>${product.price}</Text>

      <Text>{product.description}</Text>

      <Text style={styles.rating}>Rating: {product.rating}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  mainImageContainer: {
    position: "relative",
    alignItems: "center",
  },

  mainImage: {
    width: 300,
    height: 300,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },

  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },

  rating: {
    marginTop: 15,
  },

  leftArrow: {
    position: "absolute",
    left: 10,
    top: "45%",
    zIndex: 1,
  },

  rightArrow: {
    position: "absolute",
    right: 10,
    top: "45%",
    zIndex: 1,
  },

  arrowText: {
    fontSize: 40,
    fontWeight: "bold",
  },

  hiddenImage: {
    opacity: 0,
  },

  imagePlaceholder: {
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
  },
});

export default ProductDetailScreen;

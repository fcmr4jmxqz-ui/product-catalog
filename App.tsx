import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList, Image, Button } from "react-native";
import { getProducts } from "./src/api/ProductApi"; //temp
import { useEffect, useState } from "react"; //temp
import { Product } from "./src/types/Product"; //temp

export default function App() {
  const [products, setProducts] = useState<Product[]>([]); //temp
  const [skip, setSkip] = useState<number>(0);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  async function loadProducts() {
    try {
      setError(null);
      if (skip === 0) {
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
      }
      const { products: newProducts, total } = await getProducts(20, skip); //data from API

      if (skip + newProducts.length < total) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
      setProducts((previousProducts) => {
        return [...previousProducts, ...newProducts];
      });
    } catch (error) {
      setError("Failed to load products, please try again later.");
    } finally {
      if (skip === 0) {
        setInitialLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }

  useEffect(() => {
    loadProducts();
  }, [skip]); //temp

  return (
    <View style={styles.container}>
      {error !== null && (
        <View>
          <Text>{error}</Text>
          <Button title="Retry" onPress={loadProducts} />
        </View>
      )}
      <FlatList
        data={products}
        renderItem={({ item }) => {
          return (
            <View>
              <Text>{item.title}</Text>
              <Text>{item.price}</Text>
              <Image source={{ uri: item.thumbnail }} style={styles.image} />
            </View>
          );
        }}
        onEndReached={() => {
          if (!initialLoading && !loadingMore && !error && hasMore) {
            setSkip((previousSkip) => previousSkip + 20);
          }
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
});

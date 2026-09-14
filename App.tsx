import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  ActivityIndicator,
} from "react-native";
import { getProducts } from "./src/api/ProductApi"; //temp
import { useEffect, useState } from "react"; //temp
import { Product } from "./src/types/Product"; //temp
import ProductCard from "./src/components/ProductCard"; //temp
import ProductCardSkeleton from "./src/components/ProductCardSkeleton"; //temp
import EmptyState from "./src/components/EmptyState"; //temp

export default function App() {
  const [products, setProducts] = useState<Product[]>([]); //temp
  const [skip, setSkip] = useState<number>(0);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [retrying, setRetrying] = useState<boolean>(false);
  const [retrySuccess, setRetrySuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  async function loadProducts(): Promise<boolean> {
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
      return false;
    } finally {
      if (skip === 0) {
        setInitialLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
    return true;
  }

  async function handleRetry() {
    setRetrying(true);

    const success = await loadProducts();

    setRetrying(false);

    if (success) {
      setRetrySuccess(true);

      setTimeout(() => {
        setRetrySuccess(false);
      });
    }
  }

  useEffect(() => {
    loadProducts();
  }, [skip]); //temp

  let content;

  if (initialLoading) {
    content = (
      <View>
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </View>
    );
  } else if (error !== null) {
    content = (
      <View>
        {retrying && <ActivityIndicator />}
        <Text>{error}</Text>
        <Button
          title={retrying ? "Retrying" : "Retry"}
          onPress={handleRetry}
          disabled={retrying}
        />
      </View>
    );
  } else if (products.length === 0) {
    content = <EmptyState />;
  } else {
    content = (
      <FlatList
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator />
              <Text>Loading more...</Text>
            </View>
          ) : null
        }
        data={products}
        renderItem={({ item }) => {
          return <ProductCard product={item} />;
        }}
        onEndReached={() => {
          if (!initialLoading && !loadingMore && !error && hasMore) {
            setSkip((previousSkip) => previousSkip + 20);
          }
        }}
      />
    );
  }
  return (
    <View style={styles.container}>
      {retrySuccess && <Text>✓ Success</Text>}
      {content}

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

  loadingMore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});

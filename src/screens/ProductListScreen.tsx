import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";

import { getProducts, searchProducts } from "../api/ProductApi";
import { Product } from "../types/Product";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import EmptyState from "../components/EmptyState";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

const ProductListScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [skip, setSkip] = useState<number>(0);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [retrying, setRetrying] = useState<boolean>(false);
  const [retrySuccess, setRetrySuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  async function loadProducts(isRefreshing: boolean = false): Promise<boolean> {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      }
      if (skip === 0) {
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
      }

      let newProducts: Product[];
      let total: number;

      if (debouncedSearchQuery.trim() !== "") {
        const result = await searchProducts(debouncedSearchQuery, 20, skip);

        newProducts = result.products;
        total = result.total;
      } else {
        const result = await getProducts(20, skip);

        newProducts = result.products;
        total = result.total;
      }

      if (skip === 0) {
        setProducts(newProducts);
      } else {
        setProducts((previousProducts) => {
          return [...previousProducts, ...newProducts];
        });
      }

      if (skip + newProducts.length < total) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }

      return true;
    } catch (error) {
      setError("Failed to load products, please try again later.");
      return false;
    } finally {
      if (skip === 0) {
        setInitialLoading(false);
      } else {
        setLoadingMore(false);
      }
      if (isRefreshing) {
        setRefreshing(false);
      }
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    setSkip(0);
    await loadProducts(true);
  }

  async function handleRetry() {
    setRetrying(true);

    const success = await loadProducts();

    setRetrying(false);

    if (success) {
      setError(null);
      setRetrySuccess(true);

      setTimeout(() => {
        setRetrySuccess(false);
      }, 2000);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setSkip(0);
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    loadProducts();
  }, [skip, debouncedSearchQuery]);

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
        refreshing={refreshing}
        onRefresh={handleRefresh}
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
          return (
            <ProductCard
              product={item}
              onPress={() => {
                navigation.navigate("ProductDetail", {
                  productId: item.id,
                });
              }}
            />
          );
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
      {retrySuccess && (
        <View style={styles.successMessage}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successText}>Success</Text>
        </View>
      )}
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
        }}
        placeholder="Search products..."
      />
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loadingMore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  successMessage: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 10,
  },

  successIcon: {
    color: "green",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 6,
  },

  successText: {
    color: "green",
    fontSize: 15,
    fontWeight: "600",
  },

  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
});

export default ProductListScreen;

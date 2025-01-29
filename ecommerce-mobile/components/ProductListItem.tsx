import { View, Text } from "react-native";

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function ProductListItem({ product }: { product: Product }) {
  return (
    <View>
      <Text>{product.name}</Text>
      <Text>{product.price}</Text>
    </View>
  );
}

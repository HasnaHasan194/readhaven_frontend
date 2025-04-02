import {
  addToCart,
  getCartCount,
  getCartProducts,
  removeCartItem,
} from "@/api/User/cartApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCartQuery = () => {
  return useQuery({
    queryKey: ["cart-count"],
    queryFn: () => getCartCount(),
  });
};

export const useCartItem = () => {
  return useQuery({
    queryKey: ["cart-item"],
    queryFn: () => getCartProducts(),
  });
};

export const useCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
  });
};

export const useCartItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
      queryClient.invalidateQueries({ queryKey: ["cart-item"] });
    },
  });
};

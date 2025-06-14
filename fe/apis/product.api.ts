import { categories } from "app/(dashboard)/homepage";
import httpRequest from "../services/httpRequest";

export const getAllProducts = () => {
	return httpRequest.get("/products");
};
export const getTenProducts = () => {
	return httpRequest.get("/products/ten");
};
export const searchProductsByName = (value: string) => {
	return httpRequest.get("/products/search", {
		params: {
			keyword: value,
		},
	});
};

export const createNewProduct = (data: any) => {
	return httpRequest.post("/products", data);
};
export const getFilteredProduct = (categoryId: number) => {
	return httpRequest.get(`/products/filtered/${categoryId}`);
};
export const getProductById = (productId: string | number) => {
	return httpRequest.get(`/products/${productId}`);
};
export const getProductsByIds = async (ids: number[]) => {
	return httpRequest.post("/products/getByIds", { ids });
};

export const updateProductById = (productId: string | number, data: any) => {
	return httpRequest.put2(`/products/${productId}`, data);
};
export const updateProductLike = (productId: string | number) => {
	return httpRequest.put2(`/products/like/${productId}`);
};
export const updateProductLike2 = (productId: string | number) => {
	return httpRequest.put2(`/products/like2/${productId}`);
};
export const deleteProductById = (productId: string | number) => {
	return httpRequest.delete(`/products/${productId}`);
};

// export const getAllReviews = (productId: string | number) => {
//   return httpRequest.get(`/reviews/${productId}`);
// };

// export const addReview = (data: any) => {
//   return httpRequest.post("/reviews", data);
// };

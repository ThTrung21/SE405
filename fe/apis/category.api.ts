import httpRequest from "../services/httpRequest";

export const getAllCategories = () => {
  return httpRequest.get("/categories");
};

import httpRequest from "../services/httpRequest";

export const getAllBrands = () => {
  return httpRequest.get("/brands");
};

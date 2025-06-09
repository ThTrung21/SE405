import httpRequest from "../services/httpRequest";

export const getAllUsers = () => {
  return httpRequest.get("/users");
};
export const getAllStaff = () => {
  return httpRequest.get("/users/s");
};
export const createNewUser = (data: any) => {
  return httpRequest.post("/users", data);
};
export const createNewStaff = (data: any) => {
  return httpRequest.post("/users/staff", data);
};

export const getUserById = (userId: string) => {
  return httpRequest.get(`/users/${userId}`);
};

export const updateUserById = (userId: string | number, data: any) => {
  return httpRequest.put(`/users/${userId}`, data);
};

export const updateUserProfile = (data: any) => {
  return httpRequest.put("/users/profile", data);
};

export const deleteUserById = (userId: string | number) => {
  return httpRequest.delete(`/users/${userId}`);
};

export const changeUserPassword = (data: any) => {
  return httpRequest.patch("/users/change-password", data);
};
export const updateUserLike = (data: any) => {
  return httpRequest.patch("/users/update-like", data);
};

export const changeUserStatus = (userId: string | number, isActive: 0 | 1) => {
  return httpRequest.patch(`users/change-status/${userId}/${isActive}`);
};

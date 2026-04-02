import api from "../config/api";

export const getPermissions = async () => {
  const res = await api.get("/permissions");
  return res.data;
};

export const addPermission = async (name, description) => {
  await api.post("/permissions", { name, description });
};

export const deletePermission = async (id) => {
  await api.delete(`/permissions/${id}`);
};


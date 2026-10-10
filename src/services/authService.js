import api from "./api";

export async function loginUser(employeeId, password) {
  const response = await api.post("/login", {
    employeeId,
    password,
  });

  return response.data;
}
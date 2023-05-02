import jwt_decode from "jwt-decode";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  return localStorage.setItem("token", token);
}

export function removeToken() {
  return localStorage.removeItem("token");
}

export function getUserIdFromToken() {
  return decodeToken()?.unique_name;
}

export function getTypeFromToken() {
  return decodeToken()?.role;
}

function decodeToken(): any {
  const token = getToken();
  return !!token ? jwt_decode(token) : null;
}

import axios from "axios";

function deleteUser(userId: string) {
  return axios.delete(`/userService/api/users/${userId}`);
}

export { deleteUser };

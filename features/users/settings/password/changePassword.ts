import axios from "axios";
import { z } from "zod";
import { passwordSchema } from "../../registration/createUser";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Old password should be provided."),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Password should be confirmed."),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

type ChangePassword = z.infer<typeof changePasswordSchema>;

function changePasswordForUser(userId: string) {
  return (changePassword: ChangePassword) => {
    return axios.put(`/userService/api/users/${userId}/account/password`, changePassword);
  };
}

export { changePasswordSchema, changePasswordForUser };

export type { ChangePassword };

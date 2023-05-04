import axios from "axios";
import { z } from "zod";
import { ALPHANUMERIC_AND_WHITESPACE_REGEX, ALPHA_REGEX } from "../../../../patterns";

const updatePersonalInfoSchema = z.object({
  firstName: z
    .string()
    .min(3, "First name should be provided.")
    .regex(ALPHA_REGEX, "First name should only contain alpha characters."),
  lastName: z
    .string()
    .min(3, "Last name should be provided.")
    .regex(ALPHA_REGEX, "Last name should only contain alpha characters."),
  email: z.string().email("Email should be valid."),
  city: z
    .string()
    .min(1, "City should be provided.")
    .regex(ALPHANUMERIC_AND_WHITESPACE_REGEX, "City should only contrain alphanumeric characters"),
});

type UpdatePersonalInfo = z.infer<typeof updatePersonalInfoSchema>;

function updatePersonalInfoForUser(userId: string) {
  return (updateProfile: UpdatePersonalInfo) => {
    return axios.put(`/userService/api/users/${userId}`, updateProfile);
  };
}

export { updatePersonalInfoSchema, updatePersonalInfoForUser };

export type { UpdatePersonalInfo };

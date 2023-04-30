import axios from "axios";
import * as z from "zod";
import {
  ALPHANUMERIC_AND_WHITESPACE_REGEX,
  ALPHANUMERIC_REGEX,
  ALPHA_REGEX,
  LOWER_CASE_REGEX,
  NUMERIC_REGEX,
  SPECIAL_CHARACTERS_REGEX,
  UPPER_CASE_REGEX,
} from "../../../patterns";

const passwordSchema = z
  .string()
  .min(8, "Password should have at least 8 characters.")
  .regex(UPPER_CASE_REGEX, "Password should have at least 1 capital letter.")
  .regex(LOWER_CASE_REGEX, "Password should have at least 1 lower letter.")
  .regex(NUMERIC_REGEX, "Password should have at least 1 number.")
  .regex(SPECIAL_CHARACTERS_REGEX, "Password should have at least 1 special character.");

const usernameSchema = z
  .string()
  .min(3, "Username should have at least 3 characters.")
  .regex(ALPHANUMERIC_REGEX, "Username should contain only alphanumeric characters.");

const accountSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

const createUserSchema = z.object({
  account: accountSchema,
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
  type: z.string().or(z.number()),
});

type CreateUser = z.infer<typeof createUserSchema>;

function createUser(user: CreateUser) {
  return axios.post("/userService/api/users", user);
}

export { passwordSchema, createUserSchema, createUser };

export type { CreateUser };

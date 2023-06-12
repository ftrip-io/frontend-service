import { type FC } from "react";
import { InputField } from "../../../core/components/InputField";
import { Button } from "../../../core/components/Button";
import { createUser, type CreateUser, createUserSchema } from "./createUser";
import { extractErrorMessage } from "../../../core/utils/errors";
import { useNotifications } from "../../../core/hooks/useNotifications";
import { ResultStatus } from "../../../core/contexts/Result";
import { useAction } from "../../../core/hooks/useAction";
import { useZodValidatedFrom } from "../../../core/hooks/useZodValidatedForm";
import { useUsersResult } from "../useUsersResult";
import Link from "next/link";
import { SelectOptionField } from "../../../core/components/SelectOptionField";

const userTypeOptions = [
  { label: "Guest", value: 0 },
  { label: "Host", value: 1 },
];

export const RegistrationForm: FC = () => {
  const notifications = useNotifications();
  const { setResult } = useUsersResult();

  const {
    register: registrationForm,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useZodValidatedFrom<CreateUser>(createUserSchema);
  const type = watch("type");

  const createUserAction = useAction<CreateUser>(createUser, {
    onSuccess: () => {
      notifications.success("You have successfully created a new account.");
      setResult({ status: ResultStatus.Ok, type: "CREATE_USER" });
    },
    onError: (error: any) => {
      notifications.error(extractErrorMessage(error));
      setResult({ status: ResultStatus.Error, type: "CREATE_USER" });
    },
  });

  const beforeCreateUserAction = (createUser: CreateUser) => {
    createUser.type = +createUser.type;
    createUserAction(createUser);
  };

  return (
    <>
      <form onSubmit={handleSubmit(beforeCreateUserAction)}>
        <div className="overflow-hidden shadow sm:rounded-md">
          <div className="bg-white px-4 py-5 sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-3">
                <InputField
                  label="Username"
                  formElement={registrationForm("account.username")}
                  errorMessage={errors?.account?.username?.message}
                />
              </div>

              <div className="col-span-3">
                <InputField
                  type="password"
                  label="Password"
                  formElement={registrationForm("account.password")}
                  errorMessage={errors?.account?.password?.message}
                />
              </div>

              <div className="col-span-3">
                <InputField
                  label="First name"
                  formElement={registrationForm("firstName")}
                  errorMessage={errors?.firstName?.message}
                />
              </div>

              <div className="col-span-3">
                <InputField
                  label="Last name"
                  formElement={registrationForm("lastName")}
                  errorMessage={errors?.lastName?.message}
                />
              </div>

              <div className="col-span-6">
                <InputField
                  label="Email"
                  formElement={registrationForm("email")}
                  errorMessage={errors?.email?.message}
                />
              </div>

              <div className="col-span-6">
                <InputField
                  label="City"
                  formElement={registrationForm("city")}
                  errorMessage={errors?.city?.message}
                />
              </div>

              <div className="col-span-6">
                <SelectOptionField
                  label="You are"
                  formElement={registrationForm("type")}
                  errorMessage={errors.type?.message}
                  value={type}
                  onChange={(value) => setValue("type", value)}
                  options={userTypeOptions}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 bg-gray-50 sm:px-6 px-2 py-2">
            <div className="col-span-6 text-left">
              <Button type="button">
                <Link href="/auth">Login</Link>
              </Button>
            </div>

            <div className="col-span-6 text-right">
              <Button>Register</Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

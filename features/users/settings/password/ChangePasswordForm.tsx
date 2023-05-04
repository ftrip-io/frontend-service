import { type FC } from "react";
import { Button } from "../../../../core/components/Button";
import { InputField } from "../../../../core/components/InputField";
import { useAction } from "../../../../core/hooks/useAction";
import { useNotifications } from "../../../../core/hooks/useNotifications";
import { useZodValidatedFrom } from "../../../../core/hooks/useZodValidatedForm";
import { extractErrorMessage } from "../../../../core/utils/errors";
import { ChangePassword, changePasswordForUser, changePasswordSchema } from "./changePassword";
import { onLogout, useAuthContext } from "../../../../core/contexts/Auth";

type ChangePasswordFormProps = {
  userId: string;
};

export const ChangePasswordForm: FC<ChangePasswordFormProps> = ({ userId }) => {
  const notifications = useNotifications();
  const { authDispatcher } = useAuthContext();

  const {
    register: changePasswordForm,
    handleSubmit,
    formState: { errors },
  } = useZodValidatedFrom<ChangePassword>(changePasswordSchema);

  const updatePasswordAction = useAction<ChangePassword>(changePasswordForUser(userId), {
    onSuccess: () => {
      notifications.success("You have successfully updated your password.");
      authDispatcher(onLogout());
    },
    onError: (error: any) => {
      notifications.error(extractErrorMessage(error));
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit(updatePasswordAction)}>
        <div className="overflow-hidden shadow sm:rounded-md">
          <div className="bg-white px-4 py-5 sm:p-6">
            <div className="p-2">
              <InputField
                label="Current password"
                type="password"
                formElement={changePasswordForm("currentPassword")}
                errorMessage={errors?.currentPassword?.message}
              />
            </div>
            <div className="p-2">
              <InputField
                label="New password"
                type="password"
                formElement={changePasswordForm("newPassword")}
                errorMessage={errors?.newPassword?.message}
              />
            </div>
            <div className="p-2">
              <InputField
                label="Confirm new password"
                type="password"
                formElement={changePasswordForm("confirmPassword")}
                errorMessage={errors?.confirmPassword?.message}
              />
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <Button>Change</Button>
          </div>
        </div>
      </form>
    </>
  );
};

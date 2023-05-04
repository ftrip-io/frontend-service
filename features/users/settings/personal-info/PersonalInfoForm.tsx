import { type FC } from "react";
import { Button } from "../../../../core/components/Button";
import { InputField } from "../../../../core/components/InputField";
import { ResultStatus } from "../../../../core/contexts/Result";
import { useAction } from "../../../../core/hooks/useAction";
import { useNotifications } from "../../../../core/hooks/useNotifications";
import { useZodValidatedFrom } from "../../../../core/hooks/useZodValidatedForm";
import { extractErrorMessage } from "../../../../core/utils/errors";
import { User } from "../../UserModels";
import {
  UpdatePersonalInfo,
  updatePersonalInfoForUser,
  updatePersonalInfoSchema,
} from "./updatePersonalInfo";
import { useUsersResult } from "../../useUsersResult";

type PersonalInfoFormProps = {
  user: User;
};

export const PersonalInfoForm: FC<PersonalInfoFormProps> = ({ user }) => {
  const notifications = useNotifications();
  const { setResult } = useUsersResult();
  const {
    register: personalInfoForm,
    handleSubmit,
    formState: { errors },
  } = useZodValidatedFrom<UpdatePersonalInfo>(updatePersonalInfoSchema, user);

  const updatePersonalInfoAction = useAction<UpdatePersonalInfo>(
    updatePersonalInfoForUser(user?.id),
    {
      onSuccess: () => {
        notifications.success("You have successfully updated your profile.");
        setResult({ status: ResultStatus.Ok, type: "UPDATE_USER_PROFILE" });
      },
      onError: (error: any) => {
        notifications.error(extractErrorMessage(error));
        setResult({ status: ResultStatus.Error, type: "UPDATE_USER_PROFILE" });
      },
    }
  );

  return (
    <>
      <form onSubmit={handleSubmit(updatePersonalInfoAction)}>
        <div className="overflow-hidden shadow sm:rounded-md">
          <div className="bg-white px-4 py-5 sm:p-6">
            <div className="p-2 grid grid-cols-12 gap-6">
              <div className="col-span-6">
                <InputField
                  label="Name"
                  formElement={personalInfoForm("firstName")}
                  errorMessage={errors?.firstName?.message}
                />
              </div>
              <div className="col-span-6">
                <InputField
                  label="Name"
                  formElement={personalInfoForm("lastName")}
                  errorMessage={errors?.lastName?.message}
                />
              </div>
            </div>
            <div className="p-2">
              <InputField
                label="Email"
                type="email"
                formElement={personalInfoForm("email")}
                errorMessage={errors?.email?.message}
              />
            </div>
            <div className="p-2">
              <InputField
                label="City"
                formElement={personalInfoForm("city")}
                errorMessage={errors?.city?.message}
              />
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <Button>Update</Button>
          </div>
        </div>
      </form>
    </>
  );
};

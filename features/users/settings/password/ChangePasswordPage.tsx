import { FC } from "react";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { UserSpecificProfilePageProps } from "../../../../types";

type ChangePasswordPageProps = UserSpecificProfilePageProps & {};

export const ChangePasswordPage: FC<ChangePasswordPageProps> = ({ userId }) => {
  return (
    <>
      <ChangePasswordForm userId={userId} />
    </>
  );
};

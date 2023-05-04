import { FC, useEffect } from "react";
import { useUser } from "../../useUsers";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { useUsersResult } from "../../useUsersResult";
import { UserSpecificProfilePageProps } from "../../../../types";

type PersonalInformationsPageProps = UserSpecificProfilePageProps & {};

export const PersonalInformationsPage: FC<PersonalInformationsPageProps> = ({ userId }) => {
  const { result, setResult } = useUsersResult();
  const { user, isLoading } = useUser(userId, [result]);

  useEffect(() => {
    if (!result) return;
    setResult(undefined);
  }, [result, setResult]);

  if (!user || isLoading) return <></>;

  return (
    <>
      <PersonalInfoForm user={user} />
    </>
  );
};

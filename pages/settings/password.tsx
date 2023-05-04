import { useAuthContext } from "../../core/contexts/Auth";
import { ChangePasswordPage } from "../../features/users/settings/password/ChangePasswordPage";

const ChangePassword = () => {
  const { user } = useAuthContext();

  if (!user?.id) return <></>;

  return (
    <>
      <ChangePasswordPage userId={user?.id} />
    </>
  );
};

export default ChangePassword;

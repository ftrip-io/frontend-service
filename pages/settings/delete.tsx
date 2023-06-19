import { useAuthContext } from "../../core/contexts/Auth";
import { DeleteUserPage } from "../../features/users/settings/delete/DeleteUserPage";

const DeleteUser = () => {
  const { user } = useAuthContext();

  if (!user?.id) return <></>;

  return (
    <>
      <DeleteUserPage userId={user?.id} />
    </>
  );
};

DeleteUser.requireAuth = true;

export default DeleteUser;

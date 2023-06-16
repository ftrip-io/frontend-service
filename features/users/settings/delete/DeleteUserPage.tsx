import { type FC } from "react";
import { Button } from "../../../../core/components/Button";
import { ResultStatus } from "../../../../core/contexts/Result";
import { useAction } from "../../../../core/hooks/useAction";
import { useNotifications } from "../../../../core/hooks/useNotifications";
import { extractErrorMessage } from "../../../../core/utils/errors";
import { deleteUser } from "./deleteUser";
import { useUsersResult } from "../../useUsersResult";
import { onLogout, useAuthContext } from "../../../../core/contexts/Auth";

type DeleteUserPageProps = {
  userId: string;
};

export const DeleteUserPage: FC<DeleteUserPageProps> = ({ userId }) => {
  const { authDispatcher } = useAuthContext();
  const notifications = useNotifications();
  const { setResult } = useUsersResult();

  const deleteUserAction = useAction<string>(deleteUser, {
    onSuccess: () => {
      notifications.success("You have successfully deleted your account.");
      setResult({ status: ResultStatus.Ok, type: "DELETE_USER" });
      authDispatcher(onLogout());
    },
    onError: (error: any) => {
      notifications.error(extractErrorMessage(error));
      setResult({ status: ResultStatus.Error, type: "DELETE_USER" });
    },
  });

  return (
    <>
      <div className="flex items-center border-2 rounded-lg border-red-700 p-2">
        <div className="grow">
          <p className="font-medium">Delete your account</p>
          <p>Once you delete your account, there is no going back. Please be certain.</p>
        </div>

        <Button className="text-right" onClick={() => deleteUserAction(userId)}>
          Delete
        </Button>
      </div>
    </>
  );
};

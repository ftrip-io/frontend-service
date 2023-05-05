import { useAuthContext } from "../../core/contexts/Auth";
import { PersonalInformationsPage } from "../../features/users/settings/personal-info/PersonalInfoPage";

const Profile = () => {
  const { user } = useAuthContext();

  if (!user?.id) return <></>;

  return (
    <>
      <PersonalInformationsPage userId={user?.id} />
    </>
  );
};

export default Profile;

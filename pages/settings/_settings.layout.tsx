import { type FC, type PropsWithChildren } from "react";
import { useAuthContext } from "../../core/contexts/Auth";
import { HorizontalMenu, type MenuItem } from "../../core/components/HorizontalMenu";

const links: MenuItem[] = [
  {
    title: "Profile",
    path: "/settings",
  },
  {
    title: "Change password",
    path: "/settings/password",
  },
  {
    title: "Notifications",
    path: "/settings/notifications",
  },
  {
    title: "Delete",
    path: "/settings/delete",
  },
];

export const SettingsLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuthContext();

  if (!user || !user.id) return <></>;

  return (
    <>
      <HorizontalMenu links={links} />

      <div className="mt-10">{children}</div>
    </>
  );
};

export default SettingsLayout;

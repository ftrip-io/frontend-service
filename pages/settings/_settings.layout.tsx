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
];

export const SettingsLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuthContext();

  if (!user) return <></>;

  return (
    <>
      <HorizontalMenu links={links} />

      <div className="mt-10">{children}</div>
    </>
  );
};

export default SettingsLayout;

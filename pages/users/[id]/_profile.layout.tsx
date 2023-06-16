import { useEffect, type FC, type PropsWithChildren } from "react";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { useUser } from "../../../features/users/useUsers";
import { Button } from "../../../core/components/Button";
import { type User, UserType } from "../../../features/users/UserModels";
import { VerticalMenu } from "../../../core/components/VerticalMenu";
import { useUsersResult } from "../../../features/users/useUsersResult";
import { UserSpecific } from "../../../core/components/UserSpecific";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { HostReviewsSummary } from "../../../features/reviews/hosts/HostReviewsSummary";
import { useAuthContext } from "../../../core/contexts/Auth";

function getSharedLinks(router: NextRouter, user: User, authUserId: string) {
  return [
    {
      title: "Reservation Requests",
      icon: <BookOpenIcon className="h-6 w-6 text-gray-500" />,
      path: "/users/[id]/reservation-requests",
      onClick: async () => {
        await router.push(`/users/${user?.id}/reservation-requests`);
      },
      show: () => user?.id === authUserId,
    },
    {
      title: "Reservations",
      icon: <BookOpenIcon className="h-6 w-6 text-gray-500" />,
      path: "/users/[id]/reservations",
      onClick: async () => {
        await router.push(`/users/${user?.id}/reservations`);
      },
      show: () => user?.id === authUserId || user?.type === UserType.Guest,
    },
  ];
}

function getLinksForGuest(router: NextRouter, user: User, authUserId: string) {
  return [
    ...getSharedLinks(router, user, authUserId),
    {
      title: "Accommodation Reviews",
      icon: <ChatBubbleLeftIcon className="h-6 w-6 text-gray-500" />,
      path: "/users/[id]/reviews/accommodations",
      onClick: async () => {
        await router.push(`/users/${user?.id}/reviews/accommodations`);
      },
    },
    {
      title: "Host Reviews",
      icon: <ChatBubbleLeftIcon className="h-6 w-6 text-gray-500" />,
      path: "/users/[id]/reviews/hosts",
      onClick: async () => {
        await router.push(`/users/${user?.id}/reviews/hosts`);
      },
    },
  ];
}

function getLinksForHost(router: NextRouter, user: User, authUserId: string) {
  return [
    ...getSharedLinks(router, user, authUserId),
    {
      title: "Reviews",
      icon: <ChatBubbleLeftIcon className="h-6 w-6 text-gray-500" />,
      path: "/users/[id]/reviews",
      onClick: async () => {
        await router.push(`/users/${user?.id}/reviews`);
      },
    },
  ];
}

type UserInformationsProps = {
  user: User;
};

const UserInformations: FC<UserInformationsProps> = ({ user }) => {
  return (
    <>
      <div className="ml-2 mb-2 space-y-2">
        <div className="text-4xl font-medium">
          {user.firstName} {user.lastName}
        </div>
        {user.type === UserType.Host ? <HostReviewsSummary hostId={user.id} /> : <></>}

        <div className="text-2xl">{user.email}</div>
        <div className="text-xl">{user.city}</div>
      </div>

      <div className="flex">
        <UserSpecific userId={user.id}>
          <Button className="grow">
            <Link href={"/settings"}>Change profile info</Link>
          </Button>
        </UserSpecific>
      </div>
    </>
  );
};

export const ProfileLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const { result, setResult } = useUsersResult();

  const authUserId = useAuthContext().user?.id ?? "";
  const userId = router.query?.id?.toString() ?? "";
  const { user } = useUser(userId, [result]);

  useEffect(() => {
    if (!result) return;
    setResult(undefined);
  }, [result, setResult]);

  const linksFactory = user?.type === UserType.Guest ? getLinksForGuest : getLinksForHost;
  const links = linksFactory(router, user, authUserId);

  if (!userId || !user) return <></>;

  return (
    <>
      <div className="flex">
        <div>
          <aside className="w-96" aria-label="Sidebar">
            <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded">
              <UserInformations user={user} />

              <div className="pt-4 mt-4 space-y-2 border-t border-gray-200" />

              <VerticalMenu links={links} />
            </div>
          </aside>
        </div>
        <div className="grow">{children}</div>
      </div>
    </>
  );
};

export default ProfileLayout;

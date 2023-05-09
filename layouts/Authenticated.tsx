import { type FC, Fragment, type PropsWithChildren, useCallback } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { AuthUser, useAuthContext } from "../core/contexts/Auth";
import Link from "next/link";
import { type NextRouter, useRouter } from "next/router";
import Image from "next/image";
import { getUserIdFromToken } from "../core/utils/token";
import { useNotificationsResult } from "../features/notifications/useNotificationsResult";
import { useTNotificationsCount } from "../features/notifications/useNotificationsCount";
import { useHoverable } from "../core/hooks/useHoverable";

let loggedUser: AuthUser | undefined;

const userNavigation = [
  {
    name: "Your Profile",
    onClick: async (router: NextRouter) => await router.push(`/users/${loggedUser?.id}`),
  },
  { name: "Settings", onClick: async (router: NextRouter) => await router.push(`/settings`) },
  { name: "Sign out", onClick: async (router: NextRouter) => await router.push(`/logout`) },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const NavigationButton = () => {
  const router = useRouter();

  const { result } = useNotificationsResult();
  const { notificationsCount } = useTNotificationsCount(getUserIdFromToken(), "false", [result]);
  const navigateToNotifications = useCallback(() => router.push("/notifications"), [router]);

  const { isHover, hoverAttributes } = useHoverable();

  return (
    <>
      <button
        type="button"
        className="rounded-full p-1 bg-gray-800 hover:text-white"
        onClick={navigateToNotifications}
        {...hoverAttributes}
      >
        <span className="sr-only">View notifications</span>
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
          style={
            notificationsCount && !isHover
              ? {
                  filter:
                    "invert(13%) sepia(97%) saturate(7455%) hue-rotate(5deg) brightness(102%) contrast(103%)",
                }
              : {}
          }
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
      </button>
    </>
  );
};

export const AuthenticatedLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { user } = useAuthContext();

  loggedUser = user;

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Link href="/">
                        <Image
                          width={40}
                          height={40}
                          style={{
                            filter: "invert(100%)",
                          }}
                          src="/ftrip-io.png"
                          alt=""
                          priority={true}
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <NavigationButton />

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            Profile Image
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    onClick={async () => await item.onClick(router)}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    <NavigationButton />

                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="border-t border-gray-700 pt-4 pb-3">
                  <div className="flex items-center px-5">
                    <div className="rounded-full">Profile Image</div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href="#"
                        onClick={() => item.onClick(router)}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
};

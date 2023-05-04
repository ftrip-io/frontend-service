import { type FC, type PropsWithChildren } from "react";
import { useRouter } from "next/router";
import SettingsLayout from "./settings/_settings.layout";

type NestedLayout = {
  path: string;
  pathMatch: "startsWith" | "exact";
  component: FC<PropsWithChildren>;
  children?: NestedLayoutChild[];
};

type NestedLayoutChild = {
  path: string;
  component: FC<PropsWithChildren>;
};

const registeredLayouts: NestedLayout[] = [
  {
    path: "/settings",
    pathMatch: "startsWith",
    component: SettingsLayout,
  },
];

function match(path: string, routerPath: string, matchType: string) {
  const cleanedRouterPath = routerPath.replace("#", "");
  const matchers: any = {
    startsWith: () => cleanedRouterPath.startsWith(path),
    exact: () => cleanedRouterPath.startsWith(path),
  };

  return (matchers[matchType] || (() => false))();
}

export const NestedLayoutResolver: FC<PropsWithChildren> = ({ children }) => {
  const r = useRouter();

  const findLayoutComponent = () => {
    for (const layout of registeredLayouts) {
      for (const childLayout of layout.children || []) {
        if (match(layout.path + childLayout.path, r.pathname, layout.pathMatch)) {
          const NestedLayout: FC<PropsWithChildren> = ({ children }) => {
            return (
              <>
                <layout.component>
                  <childLayout.component>{children}</childLayout.component>
                </layout.component>
              </>
            );
          };
          return NestedLayout;
        }
      }

      if (match(layout.path, r.pathname, layout.pathMatch)) {
        return layout.component;
      }
    }

    return undefined;
  };

  const LayoutComponent = findLayoutComponent();

  if (!LayoutComponent) return <>{children}</>;

  return (
    <>
      <LayoutComponent>{children}</LayoutComponent>
    </>
  );
};

export default NestedLayoutResolver;

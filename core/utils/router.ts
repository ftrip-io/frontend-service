import type { NextRouter } from "next/router";

function addQueryParam(router: NextRouter, query: any) {
  const url = {
    pathname: router.pathname,
    query: { ...router.query, ...query },
  };
  router.push(url, undefined, { shallow: true });
}

export { addQueryParam };

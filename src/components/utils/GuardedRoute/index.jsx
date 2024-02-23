import { Route } from "react-router";

import WorldLayout from "../../layout/World";

export default function GuardedRoute({
  component: Component,
  auth,
  redirect,
  path,
  authRequired = true,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <WorldLayout>
            <Component {...props} {...rest} />
          </WorldLayout>
        );
      }}
    />
  );
}

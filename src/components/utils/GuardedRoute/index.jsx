import WorldLayout from "../../layout/World";

const GuardedRoute = ({
  component: Component,
  auth,
  redirect,
  authRequired = true,
  ...rest
}) => {
  // Logic to check authentication and possibly redirect
  if (!auth && authRequired) {
    // Implement your redirection logic here
    // For example, using navigate from react-router-dom v6
    // navigate(redirect);
  }

  // Render the component within the layout if auth check passes
  return (
    <WorldLayout>
      <Component {...rest} />
    </WorldLayout>
  );
};

export default GuardedRoute;

import withRouter from "Common/withRouter";
import { LoginView } from "feature";

const Login = (props: any) => {
  document.title = "Login";

  return <LoginView></LoginView>;
};

export default withRouter(Login);

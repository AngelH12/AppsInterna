import withRouter from "Common/withRouter";
import { LoginView } from "feature";
import { EnviosView } from "feature/Envios/feature/EnviosView";

const Envios = (props: any) => {
  document.title = "Login";

  return <EnviosView></EnviosView>;
};

export default withRouter(Envios);





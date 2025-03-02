import withRouter from "Common/withRouter";
import { UsuariosView } from "feature/Usuarios/feature/UsuariosView";

const Usuarios = (props: any) => {
  document.title = "Login";

  return <UsuariosView></UsuariosView>;
};

export default withRouter(Usuarios);


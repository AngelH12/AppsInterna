import withRouter from "Common/withRouter";
import { ProveedoresView } from "feature/Proveedores/feature/ProveedoresView";

const Proveedores = (props: any) => {
  document.title = "Login";

  return <ProveedoresView></ProveedoresView>;
};

export default withRouter(Proveedores);




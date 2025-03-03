import withRouter from "Common/withRouter";
import { InventarioView } from "feature/Inventario/feature/InventarioView";

const Inventario = (props: any) => {
  document.title = "Login";

  return <InventarioView></InventarioView>;
};

export default withRouter(Inventario);




import withRouter from "Common/withRouter";
import { PedidosView } from "feature/Pedidos/feature/PedidosView";

const Pedidos = (props: any) => {
  document.title = "Login";

  return <PedidosView></PedidosView>;
};

export default withRouter(Pedidos);






import withRouter from "Common/withRouter";
import { ProductosView } from "feature/GestióndeProductos/feature/ProductosView";

const Productos = (props: any) => {
  document.title = "Login";

  return <ProductosView></ProductosView>;
};

export default withRouter(Productos);


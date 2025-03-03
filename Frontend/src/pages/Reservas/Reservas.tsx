import withRouter from "Common/withRouter";
import { LoginView } from "feature";
import { CombosView } from "feature/Combos/feature/CombosView";
import { ReservasView } from "feature/Reservas/feature/ReservasView";

const Reservas = (props: any) => {
  document.title = "Login";

  return <ReservasView></ReservasView>;
};

export default withRouter(Reservas);



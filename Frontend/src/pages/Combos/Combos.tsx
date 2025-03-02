import withRouter from "Common/withRouter";
import { LoginView } from "feature";
import { CombosView } from "feature/Combos/feature/CombosView";

const Combos = (props: any) => {
  document.title = "Login";

  return <CombosView></CombosView>;
};

export default withRouter(Combos);




import withRouter from "Common/withRouter";
import { GuarnicionesView } from "feature/Guarniciones/feature/GuarnicionesView";

const Guarniciones = (props: any) => {
  document.title = "Login";

  return <GuarnicionesView></GuarnicionesView>;
};

export default withRouter(Guarniciones);

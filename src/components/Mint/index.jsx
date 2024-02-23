//import contractConfig from "../../configs/contract";
import CollectionCard from "./CollectionCard";
import { mintableCollections } from "src/configs/collections";
import { useHistory } from "react-router-dom";
import "./index.scss";

const Mints = () => {
  const history = useHistory();
  const collections = mintableCollections();

  return (

    <div className="explore-container">
      <div className='ex-header'>
        <span className='ex-header-txt clickable'>
          <span onClick={() => history.push('/marketplace')}>
            Marketplace
          </span>
          {' > '}
          <span>
            Mints
          </span>
        </span>
      </div>
      <div className="ex-content">
        <div className="row" style={{ justifyContent: "center", width: "100%" }}>
            { collections.map((c) => CollectionCard(c)) }
        </div>
      </div>
    </div>
  );

  /*return (
    <div className="discover-container">
      <div className="d-header">
        <span className="d-header-label">Mints</span>
      </div>
      <div className="d-subheader">
        <div className="d-main-tags-wrapper"></div>
      </div>

      <div className="row" style={{ justifyContent: "center" }}>
          { collections.map((c) => CollectionCard(c)) }
      </div>
    </div>
  );*/
};
export default Mints;

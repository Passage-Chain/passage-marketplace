import { useNavigate } from "react-router";
import { ReactComponent as PassageLogoIcon } from "../../assets/images/left_menu_passageLogo.svg";

function CollectionCard(props) {
  const navigate = useNavigate();

  const convertUATOMToATOM = (uatom) => {
    return `${uatom / 1000000}`;
  };

  return (
    <div
      key={props.name}
      className="col-12 col-lg-3"
      style={{ maxWidth: "440px" }}
    >
      <div className="collection-card">
        {/*<LiveBadge live={isLive()} />*/}
        <div className="preview-out" style={{ textAlign: "center" }}>
          <video
            playsInline
            muted
            loop
            autoPlay
            src={props.mint.previewUrl}
            className="preview"
            style={{ marginBottom: "0", aspectRatio: "0.72" }}
            {...(props.mint.previewUrl.includes(".png")
              ? { poster: props.mint.previewUrl }
              : {})}
          />
        </div>
        <div className="description">
          <div
            className="title"
            style={{
              font: "normal normal bold 25px/30px niveau-grotesk",
              marginBottom: "0",
            }}
          >
            <a
              href="/mint"
              style={{ color: "#FCD996" }}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/mint/${props.contracts.mint}`);
              }}
              className="card-text stretched-link text-decoration-none"
            >
              {props.label}
            </a>
          </div>
          {props.mint.description && (
            <div
              className="card-subtitle text-muted mb-3"
              style={{
                fontSize: "20px",
                textAlign: "left",
                color: "#FFFFFF",
                opacity: "0.6",
              }}
            >
              {props.mint.description}
            </div>
          )}
        </div>
        <div className="metadata">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td
                  style={{
                    display: "inlineFlex",
                    alignItems: "center",
                    borderTopLeftRadius: "8px",
                  }}
                >
                  <span className="label">PRICE</span>
                  <span className="value price">
                    {convertUATOMToATOM(props?.mint.price)}
                    <PassageLogoIcon
                      alt="PASG"
                      style={{ height: "20px", paddingBottom: "3px" }}
                    />
                  </span>
                </td>
                {/*<td style={{ borderTopRightRadius: "8px" }}>
                  <span className="label">NFT COUNT</span>
                  <span className="value">
                    {props.mintCount}
                  </span>
                </td>*/}
              </tr>
              {/*<tr>
                <td style={{ borderBottomLeftRadius: "8px" }}>
                  <span className="label">% MINTED</span>
                  {<span className="value">{`${props.mint.percentMinted}%`}</span>}
                </td>
                <td style={{ borderBottomRightRadius: "8px" }}>
                  <span className="label">ROYALTIES</span>
                  <span className="value">{`${100 * props.mint.royalties}%`}</span>
                </td>
              </tr>*/}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CollectionCard;

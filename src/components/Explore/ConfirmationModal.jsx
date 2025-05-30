import { collectionForBaseContract } from "../../configs/collections";
import Toast from "../custom/CustomToast";
import { Modal } from "antd";
import contractConfig from "../../configs/contract";

const ConfirmationModal = ({
  visible,
  setVisible,
  id,
  baseContract,
  contract,
  marketContract,
}) => {
  const delistTokens = async () => {
    const service = await contract;
    const collection = collectionForBaseContract(baseContract);
    const _id = collection?.offchainAssets ? id : parseInt(id).toString();

    try {
      const txId = await service.delistTokens(_id, marketContract);
      Toast.success(
        "NFT Succesfully Delisted",
        `Item was successfully delisted! ${txId}`,
        {
          handleClick: () =>
            window.open(`${contractConfig.ZENSCAN_BASE_URL}${txId}`, "_blank"),
        }
      );
    } catch (err) {
      Toast.contractError(err.message);
    }
  };

  return (
    <Modal
      className="world-modal"
      visible={visible}
      footer
      title="One last step before you DELIST YOUR ITEM"
      onCancel={() => setVisible(false)}
    >
      <div className="list-nft">
        <div>
          <div>Please Confirm:</div>
          <div>You want to delist your #{id}</div>
        </div>
        <div className="buttons">
          <button
            className="contract-button confirm"
            onClick={() => {
              delistTokens();
            }}
          >
            Delist
          </button>
          <button className="contract-button" onClick={() => setVisible(false)}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;

import { Modal } from "antd";

const GameModal = ({
  visible,
  setVisible,
  onCancel,
  onConfirm,
  title = "Close Session",
  content = "Are you sure?",
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  listModal = false,
  children = "",
}) => {
  const handleClick = (callback) => {
    setVisible(false);
    callback();
  };
  if (listModal) {
    return (
      <Modal
        className="list-modal"
        title={title}
        open={visible}
        footer={false}
        onCancel={() => handleClick(onCancel)}
        onOk={() => handleClick(onConfirm)}
      >
        {children}
      </Modal>
    );
  } else {
    return (
      <Modal
        className="world-modal"
        title={title}
        visible={visible}
        okText={confirmLabel}
        cancelText={cancelLabel}
        onCancel={() => handleClick(onCancel)}
        onOk={() => handleClick(onConfirm)}
      >
        <div>{content}</div>
      </Modal>
    );
  }
};

export default GameModal;

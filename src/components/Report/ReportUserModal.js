import React from "react";
import { Modal } from "antd";
import { CustomSelect, CustomInput } from "../custom";
import { ReactComponent as CloseIcon } from "../../assets/images-v2/close-x.svg"
import { ReactComponent as ReportUserIcon } from "../../assets/images-v2/report-user-icon.svg"
import { ReactComponent as DropdownIcon } from "../../assets/images-v2/dropdown-filled.svg"

const reportTypes = [
  { id: "inappropriate-picture", label: "Inappropriate Profile Picture" },
  { id: "inappropriate-chat", label: "Inappropriate Chat" },
  { id: "spamming", label: "Spamming" },
  { id: "harassment", label: "Harassment" },
  { id: "fraud", label: "Fraud" },
];

const ReportUserModal = ({ 
  showModal, 
  handleSubmit, 
  handleClose,
  handleCauseChange,
  handleDescriptionChange,
  cause,
  description
}) => {
  return (
    <Modal
      className="report-user-modal-container"
      visible={showModal}
      onCancel={handleClose}
      footer={null}
      title=""
      closeIcon={null}
      centered
      maskClosable={false}
      closable={false}
    >
      <div className="rum-header">
        <div className="rum-header-left">
          <ReportUserIcon className="report-icon"/>
          <span className="header-txt">
            Report User
          </span>
        </div>
        <CloseIcon className="close-icon" onClick={handleClose} />
      </div>

      <div className="rum-content">
        <div className="rum-content-input-wrapper">
          <CustomSelect
            suffixIcon={<DropdownIcon />}
            style={{ height: 56 }}
            label="Why are you reporting this user?"
            options={reportTypes}
            onChange={handleCauseChange}
            value={cause}
          />
        </div>
        <div className="rum-content-input-wrapper">
          <CustomInput
            rows={1}
            suffixIcon={<DropdownIcon />}
            style={{ height: 56 }}
            label="Comments (if any)"
            placeHolder='Type your comments here...'
            value={description}
            onChange={e => {
              const { value } = e.target
              handleDescriptionChange(value)
            }}
          />
        </div>
        <div className="rum-content-cta-wrapper">
          <button className="rum-btn btn-cancel" onClick={handleClose}>Cancel</button>
          <button className="rum-btn" onClick={handleSubmit}>Report</button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportUserModal;

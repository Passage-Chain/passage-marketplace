import React, { useState } from "react";
import { Modal, Select, notification } from "antd";
import { useSelector } from "react-redux";
import { ReactComponent as CloseIcon } from "../../../../assets/images/icon-close.svg";
import { ReactComponent as ReportUserIcon } from "../../../../assets/images/icon-report-user.svg";
import { ReactComponent as DropdownArrowIcon } from "../../../../assets/images/icon-arrow-down.svg";
import accountService from "../../../../services/account";
import "./index.css";
import Toast from '../../../custom/CustomToast';
import { useHistory } from 'react-router-dom';

const { Option } = Select;

const reportTypes = [
  { key: "inappropriate-picture", text: "Inappropriate Profile Picture" },
  { key: "inappropriate-chat", text: "Inappropriate Chat" },
  { key: "spamming", text: "Spamming" },
  { key: "harassment", text: "Harassment" },
  { key: "fraud", text: "Fraud" },
];

const ReportUser = (props) => {
  const [cause, setCause] = useState(undefined);
  const [description, setDescription] = useState("");
  const account = useSelector((state) => state.account);
  const history = useHistory();

  const showModal = () => {
    props.setIsModalVisible(true);
  };

  const handleCancel = () => {
    props.setIsModalVisible(false);
  };

  const handleSubmit = () => {
    const accused = props.whoReported;
    accountService
      .addReport(account.token, accused, cause, description)
      .then((res) => {
        const data = res;
        notification.success({
          message: 'The user has been reported!'
        })

        props.setIsModalVisible(false)
      })
      .catch((error) => {
        Toast.error('error', error.response.data.message);
        
      });
  }

  return (
    <Modal
      title=""
      visible={props.isModalVisible}
      onCancel={handleCancel}
      footer={null}
      className="report-container"
      closeIcon={<CloseIcon style={{ width: 72, height: 72 }} />}
    >
      <header>
        <ReportUserIcon />
        <span>REPORT USER</span>
      </header>
      <body>
        <div className="body-ele">
          <span className="questionTxt">Why are you reporting this user?</span>
          <Select
            placeholder="Select"
            suffixIcon={<DropdownArrowIcon />}
            className="select-report-type"
            dropdownClassName="report-type-dropdown"
            value={cause}
            onChange={setCause}
          >
            {reportTypes.map((reportType) => (
              <Option key={reportType.key}>{reportType.text}</Option>
            ))}
          </Select>
        </div>
        <div className="body-ele">
          <span className="questionTxt">Comments (Optional)</span>
          <textarea
            placeholder="Type your comments here…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="questionInput"
          />
        </div>
      </body>
      <footer>
        <button onClick={handleCancel} className="cancel-btn">CANCEL</button>
        <button disabled={!cause} onClick={handleSubmit} className="report-btn">REPORT</button>
      </footer>
    </Modal>
  );
};

export default ReportUser;

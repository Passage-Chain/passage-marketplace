import { useEffect, useState } from "react";
import "./index.scss";
import { Layout, Row, Col } from "antd";
import { Toggle } from "../shared/ToggelSwitch/Toggle";
import PendingConfirmModal from "../Social/PendingConfirmModal"
import accountHttpService from "../../services/account";
import { useSelector } from "react-redux";
import Toast from '../custom/CustomToast';
import { handleApiError } from "../utils/AuthVerify/AuthVerify";

const { Content } = Layout;

const Notification = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notificationList, setNotification] = useState([]);
  const [initialNotification, setInitialNotification] = useState();
  const account = useSelector((state) => state.account);
  const onCancel = () => {
    setNotification([]);
    const originalCopy = JSON.parse(JSON.stringify(initialNotification))
    setTimeout(()=> (setNotification(originalCopy)), 200) ;
  };
  const getAllNotification = () => {
    accountHttpService
      .getUserSettingNotification()
      .then((response) => {
        if (response && response.data.notificationSettings) {
          const { notificationSettings } = response.data;
          setNotification(notificationSettings);
          setInitialNotification(JSON.parse(JSON.stringify(notificationSettings)));
        }
      })
      .catch((error) => {
       handleApiError(error);
        
      });
  };
  useEffect(() => {
    getAllNotification();
  }, []);
  const onSaveChanges = () => {
    accountHttpService
      .updateUserSettingNotification(notificationList)
      .then((response) => {
        setInitialNotification(JSON.parse(JSON.stringify(notificationList)));
        Toast.success('Notifications', "Notifications updated successfully");
      })
      .catch((error) => {
        handleApiError(error);
      });
  }
  return (
    <Layout
      className="site-layout background-none"
      style={{ "background-color": "#001529" }}
    >
      <Content
        style={{
          minHeight: 280,
        }}
      >
        <h2 className="setting-header" style={{ fontSize: "24px" }}>
          NOTIFICATIONS
        </h2>
        <label style={{ color: "#FFFFFF" }}>
          Choose what type of notifications you want to receive
        </label>
        {/** Audio Section */}
        <div className="section-layout-outer mt-15">
          <div className="section-header">NOTIFICATION PREFERENCES</div>
          <div className="section-layout-inner" style={{ height: "192px" }}>
            <Row align="left" style={{ width: "100%" }}>
              {notificationList.length > 0 && notificationList.map((item, idx) =>
                <Col span={24} key={idx}>
                  <Toggle label={item.title} toggled={item.value} onClick={() => item.value = !item.value}></Toggle>
                </Col>
              )}
            </Row>

          </div>
        </div>

        <Row align="left" className="mt-15">
          <Col >
            <button className="setting-button setting-button-active" onClick={onSaveChanges}>
              SAVE CHANGES
            </button>
          </Col>
          <Col style={{ marginLeft: "15px" }}>
            <button className="setting-button setting-button-active" onClick={() => onCancel()}>
              CANCEL
            </button>
          </Col>
        </Row>
        {showConfirmModal && (
          <PendingConfirmModal
            user={{ userName: 'test' }}
            type={'confirm'}
            onCancel={() => {
              setShowConfirmModal(false);
            }}
            onOkay={() => {
              console.log('leave')
            }}
          />
        )}

      </Content>
    </Layout>
  );
};

export default Notification;

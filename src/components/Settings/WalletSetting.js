import React, { useEffect, useState } from "react";
import "./index.scss";
import { Layout, Row, Col } from "antd";
import wallet from '../../assets/images/wallet.svg';
import JunoIcon from '../../assets/images/juno-wallet-icon.png'
import PassageIcon from "../../assets/images/left_menu_passageLogo.svg";
import DownArrowIcon from '../../assets/images/icon-arrow-up.svg'
import CustomInput from '../custom/Input'
import axios from "axios";
import { ReactSVG } from 'react-svg';
import { ENDPOINTS } from "../../utils/globalConstant";
import { setWallet } from "src/redux/accountSlice";
import WalletPanel from "./WalletSettings/WalletPanel";
import { Toggle } from "../shared/ToggelSwitch/Toggle";
import accountHttpService from "../../services/account"
import Toast from "../custom/CustomToast";

//const IBC_ATOM_JUNO_ID = "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9";

const { Content } = Layout;
const WalletSetting = () => {
  const [isGating, setGating] = useState(false);
  const [walletList, setWalletList] = useState([]);
  const [isNoWallet, setNoWallet] = useState(false);
  useEffect(() => {
    getAllWalletListData();
  }, []);
  useEffect(() => {
    setWalletList(walletList);
  }, [walletList]);

  const onNewWalletConnect = () => {
    setGating(true);
  }
  const onCancel = (e) => {
    setGating(false);
  }
  const getWalletBalance = async (walletAddress, wType) => {
    // let endPoint = (wType === 'keplr')? ENDPOINTS.KEPLR_JUNO_WALLET : ENDPOINTS.FALCON_JUNO_WALLET;
    try {
      const response = await axios.get(`${ENDPOINTS.PASSAGE_WALLET}/balances/${walletAddress}`);
      const balances = response.data.balances;

      const balance = balances.find((b) => b.denom === 'upasg')
      return balance?.amount || 0;
    } catch (err) {
      console.log(err);
    }
  };

  function toggleFunction(i) {
    var element = document.getElementById('walletID' + i);
    element.classList.toggle("display_none");
  }
  function saveWalletAddress() {
    getAllWalletListData();
  }

  function getAllWalletListData() {
    accountHttpService
      .getAllWalletList()
      .then(async (response) => {
        setWalletList([]);
        if (response.status === 200 && response.data) {
          if (response.data?.wallets.length === 0) {
            setNoWallet(true);
            setWalletList(response.data.wallets);
            return;
          }
          let result = [];
          const data = response.data.wallets;
          if (response.data?.wallets?.length) {
            for (const element of data) {
              const balance = await getWalletBalance(element.address, element.walletType);
              element['balance'] = balance;
              result.push(element);
            }
            setNoWallet(false);
            setWalletList(result);
          }
        }
      })
      .catch((error) => {
        //handleApiError(error);
        setNoWallet(true);
        setWalletList([]);
      });
  }

  function deleteWalletAddress(walletAddress) {
    accountHttpService
      .deleteWallet(walletAddress)
      .then((response) => {
        if (response.status === 200 && response.data) {
          Toast.success('Success', response.data?.message)
          getAllWalletListData();
        }
      })
      .catch((error) => {
        Toast.error('Wallet', "User can't delete active wallet");
      });
  }
  function makeWalletActive(walletAddress) {

    accountHttpService.makeWalletActive(walletAddress).then((res) => {
      getAllWalletListData();
      Toast.success('Success', res.data?.message);
    }, (err) => {
      getAllWalletListData();
    })
  }
  return (
    <Layout className="site-layout background-none" style={{ backgroundColor: "#001529" }} >
      <Content style={{ minHeight: 280 }}>
        {walletList.length &&
          <>
            <h2 className="setting-header" style={{ fontSize: "24px" }}>
              WALLET
              <button className='new-wallet-button setting-button-active' onClick={onNewWalletConnect}>LINK NEW WALLET</button>
            </h2>
            {walletList.map((e, i) => {
              return (
                <div className="wallet-section-layout-outer mt-15" key={i}>
                  <div className="section-header">
                    <div><img src={PassageIcon} alt="wallet_icon" /> <span style={{ marginLeft: 15 }}>PASSAGE WALLET</span></div>
                    <div onClick={() => toggleFunction(i)}><img alt="arrow" src={DownArrowIcon} /></div>
                  </div>
                  <div className="section-layout-inner" id={'walletID' + i}>
                    <Row align="left" style={{ width: "100%" }}>
                      <Col span={24}>
                        <h2 className="setting-header" style={{ fontSize: "20px" }}>
                          BALANCE
                        </h2>
                        <h2 className="setting-header" style={{ fontSize: "20px" }}>
                          {e.balance / 1000000} PASG
                        </h2>
                      </Col>
                    </Row>
                    <Row align="left" style={{ width: "100%" }}>
                      <Col span={24}>
                        <label className="input-lable">WALLET ADDRESS</label>
                        <CustomInput value={e.address} placeholder='WALLET ADDRESS' prefix={<ReactSVG src={wallet} />} disable={true}></CustomInput>
                      </Col>
                      <Col xs={12} >
                        <button className='setting-button setting-button-active mt-15' onClick={() => deleteWalletAddress(e.address)}>DISCONNECT WALLET</button>
                      </Col>
                      <Col xs={24}>
                        <div className={(e.active) ? 'pointer-event-none' : ''}><Toggle label="Active" toggled={e.active} onClick={() => makeWalletActive(e.address)}></Toggle></div>
                      </Col>
                    </Row>
                  </div>
                </div>
              )
            }
            )}
          </>
        }
        {isNoWallet && <>
          <h2 className="setting-header" style={{ fontSize: "24px" }}>
            WALLET
          </h2>
          <div className="wallet-section-layout-outer mt-15">
            <div className="section-header">NO WALLETS LINKED!</div>
            <div className="section-layout-inner" style={{ height: "150px" }}>
              <Row align="left" style={{ width: "100%" }}>
                <Col xs={12} >
                  <button className='setting-button setting-button-active mt-15' onClick={onNewWalletConnect}>LINK A WALLET</button>
                </Col>
              </Row>
            </div>
          </div>
        </>
        }
        {isGating && <WalletPanel onCancel={onCancel} saveWallet={saveWalletAddress} />}
      </Content>
    </Layout>
  );
};

export default WalletSetting;

import React from "react";
import { Divider } from "antd";

import PassageCoreLogo from "../../assets/images/passage-core@2x.png";
import { ReactComponent as CloseIcon } from "../../assets/images/icon-close-trans.svg";
import { ReactComponent as BottomGradiantIcon } from "../../assets/images/gradiant.svg";
import { ReactComponent as EmailIcon } from "../../assets/images/icon-email-sm.svg";
import { ReactComponent as SocialIcon } from "../../assets/images/icon-social.svg";

import { ReactComponent as TwitterIcon } from "../../assets/images/icon-twitter.svg";
import { ReactComponent as LinkedInIcon } from "../../assets/images/icon-linkedin.svg";
import { ReactComponent as InstagramIcon } from "../../assets/images/icon-instagram.svg";
import { ReactComponent as FaceIcon } from "../../assets/images/icon-face.svg";

import "./index.scss";
import { CustomButton, CustomInput } from "../custom";

const ContactUs = ({ onExit }) => {
  return (
    <div className="contact-us__container">
      <div className="outer-container">
        <div className="inner-container">
          <header>
            <div className="header-left">
              <div className="logo-container">
                <img
                  className="passage-logo"
                  src={PassageCoreLogo}
                  alt="passage-core"
                />
                <BottomGradiantIcon />
              </div>
              <Divider className="divider" type="vertical" />
              <span className="heading-txt">Contact Us</span>
            </div>

            <div className="header-right">
              <CloseIcon className="cursor-pointer" onClick={onExit} />
            </div>
          </header>

          <div className="contact-us__body">
            <div className="contact-us__left">
              <div className="contact-us__left-item-wrapper">
                <EmailIcon className="mail-icon" />
                <div className="contact-us__left-item">
                  <span className="contact-us__left-item-heading">
                    Chat with us
                  </span>
                  <span className="contact-us__left-item-subheading">
                    Our friendly team is here to help.
                  </span>
                  <a href="mailto: hello@passage3d.com" className="contact-us__left-item-link">
                    hello@passage3d.com
                  </a>
                </div>
              </div>

              <div className="contact-us__left-item-wrapper">
                <SocialIcon className="social-icon" />
                <div className="contact-us__left-item">
                  <span className="contact-us__left-item-heading">Social</span>
                  <span className="contact-us__left-item-subheading">
                    Follow us on these social media handles.
                  </span>
                  <span className="contact-us__left-item-social-handle">
                    <TwitterIcon />
                    <LinkedInIcon />
                    <InstagramIcon />
                    <FaceIcon />
                  </span>
                </div>
              </div>
            </div>
            <Divider className="contact-us__divider" type="vertical" />
            <div className="contact-us__right">
              <div className="contact-us__right-wrapper">
                <span className="contact-right-item-heading">Get in touch</span>
                <span className="contact-right-item-subheading">
                  Our friendly team would love to hear from you!
                </span>
              </div>

              <div className="contact-us__input-wrapper">
                <div className="label-text">Name</div>
                <CustomInput
                  fontColor="#ffffff"
                  height={48}
                  placeHolder="Please enter name"
                />
              </div>

              <div className="contact-us__input-wrapper">
                <div className="label-text">Email</div>
                <CustomInput
                  fontColor="#ffffff"
                  height={48}
                  placeHolder="Please enter email"
                />
              </div>

              <div className="contact-us__input-wrapper">
                <div className="label-text">Subject</div>
                <CustomInput
                  fontColor="#ffffff"
                  height={48}
                  placeHolder="Please enter subject"
                />
              </div>

              <div className="contact-us__input-wrapper">
                <div className="label-text">Comment</div>
                <CustomInput
                  fontColor="#ffffff"
                  rows={7}
                  placeHolder="Please enter comment"
                />
              </div>

              <div className="contact-us__right-action-wrapper">
                <CustomButton
                  btnStyle={{ width: 164 }}
                  labelStyle={{
                    fontSize: 14,
                  }}
                  label="SEND"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

import React from "react";
import { Divider, Collapse } from "antd";

import PassageCoreLogo from "../../assets/images/passage-core@2x.png";
import { ReactComponent as CloseIcon } from "../../assets/images/icon-close-trans.svg";
import { ReactComponent as BottomGradiantIcon } from "../../assets/images/gradiant.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/images/icon-arrow-up.svg";
import { ReactComponent as ArrowDownIcon } from "../../assets/images/icon-arrow-dwn.svg";
import "./index.scss";

const { Panel } = Collapse;

const faqs = [
  {
    id: 1,
    question: "How do I connect my Wallet?",
    answer: (
      <>
        Do this then do that then do that then do this then do that! <br />{" "}
        Explore all the cool NFTs here on:{" "}
        <a style={{ color: "#7CB5F9" }} target="_blank" rel="noreferrer" href="https://app.passage.io">
          Market Place
        </a>
      </>
    ),
  },
  {
    id: 2,
    question: "How do I add a new friend?",
    answer: (
      <>
        Do this then do that then do that then do this then do that! <br />{" "}
        Explore all the cool NFTs here on:{" "}
        <a style={{ color: "#7CB5F9" }} target="_blank" rel="noreferrer" href="https://app.passage.io">
          Market Place
        </a>
      </>
    ),
  },
  {
    id: 3,
    question: "How do I teleport to a user?",
    answer: (
      <>
        Do this then do that then do that then do this then do that! <br />{" "}
        Explore all the cool NFTs here on:{" "}
        <a style={{ color: "#7CB5F9" }} target="_blank" rel="noreferrer" href="https://app.passage.io">
          Market Place
        </a>
      </>
    ),
  },
  {
    id: 4,
    question: "Can I create a group?",
    answer: (
      <>
        Do this then do that then do that then do this then do that! <br />{" "}
        Explore all the cool NFTs here on:{" "}
        <a style={{ color: "#7CB5F9" }} target="_blank" rel="noreferrer" href="https://app.passage.io">
          Market Place
        </a>
      </>
    ),
  },
  {
    id: 5,
    question: "How do I add a new friend?",
    answer: (
      <>
        Do this then do that then do that then do this then do that! <br />{" "}
        Explore all the cool NFTs here on:{" "}
        <a style={{ color: "#7CB5F9" }} target="_blank" rel="noreferrer" href="https://app.passage.io">
          Market Place
        </a>
      </>
    ),
  },
  {
    id: 6,
    question: "How do I teleport to a user?",
    answer: (
      <>
        Do this then do that then do that then do this then do that! <br />{" "}
        Explore all the cool NFTs here on:{" "}
        <a style={{ color: "#7CB5F9" }} target="_blank" rel="noreferrer" href="https://app.passage.io">
          Market Place
        </a>
      </>
    ),
  },
  {
    id: 7,
    question: "Can I create a group?",
    answer: (
      <>
        Do this then do that then do that then do this then do that! <br />{" "}
        Explore all the cool NFTs here on:{" "}
        <a style={{ color: "#7CB5F9" }} target="_blank" rel="noreferrer" href="https://app.passage.io">
          Market Place
        </a>
      </>
    ),
  },
  {
    id: 8,
    question: "How do I add a new friend?",
    answer: (
      <>
        Do this then do that then do that then do this then do that! <br />{" "}
        Explore all the cool NFTs here on:{" "}
        <a style={{ color: "#7CB5F9" }} target="_blank" rel="noreferrer" href="https://app.passage.io">
          Market Place
        </a>
      </>
    ),
  },
  {
    id: 9,
    question: "How do I teleport to a user?",
    answer: (
      <>
        Do this then do that then do that then do this then do that! <br />{" "}
        Explore all the cool NFTs here on:{" "}
        <a style={{ color: "#7CB5F9" }} target="_blank" rel="noreferrer" href="https://app.passage.io">
          Market Place
        </a>
      </>
    ),
  },
  {
    id: 10,
    question: "Can I create a group?",
    answer: (
      <>
        Do this then do that then do that then do this then do that! <br />{" "}
        Explore all the cool NFTs here on:{" "}
        <a style={{ color: "#7CB5F9" }} target="_blank" rel="noreferrer" href="https://app.passage.io">
          Market Place
        </a>
      </>
    ),
  },
  {
    id: 11,
    question: "How do I add a new friend?",
    answer: (
      <>
        Do this then do that then do that then do this then do that! <br />{" "}
        Explore all the cool NFTs here on:{" "}
        <a style={{ color: "#7CB5F9" }} target="_blank" rel="noreferrer" href="https://app.passage.io">
          Market Place
        </a>
      </>
    ),
  },
  {
    id: 12,
    question: "How do I teleport to a user?",
    answer: (
      <>
        Do this then do that then do that then do this then do that! <br />{" "}
        Explore all the cool NFTs here on:{" "}
        <a style={{ color: "#7CB5F9" }} target="_blank" rel="noreferrer" href="https://app.passage.io">
          Market Place
        </a>
      </>
    ),
  },
];

const FAQ = ({ onExitFAQ }) => {
  return (
    <div className="faq__container">
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
              <span className="heading-txt">Frequently Asked Questions</span>
            </div>

            <div className="header-right">
              <CloseIcon className="cursor-pointer" onClick={onExitFAQ} />
            </div>
          </header>

          <body>
            <Collapse
              expandIconPosition="right"
              expandIcon={(panelProps) =>
                panelProps?.isActive ? <ArrowDownIcon /> : <ArrowUpIcon />
              }
            >
              {faqs.map((faq) => (
                <Panel key={faq.id} header={faq.question}>
                  <p>{faq.answer}</p>
                </Panel>
              ))}
            </Collapse>
          </body>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

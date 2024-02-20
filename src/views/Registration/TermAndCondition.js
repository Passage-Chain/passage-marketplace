import { Row} from "antd";

import { ReactComponent as PrivacyIcon } from '../../assets/images/privacy_icon.svg'


export default function TermAndCondition() {

  return (
    <>
      <Row>
      <div className="privacy_heading"><PrivacyIcon /> Terms of Service</div>
        <div className="term_content">

          <div>
            <div className="sub_heading">TERMS OF SERVICE AGREEMENT</div>
            <p className="text_content">This Terms of Service Agreement ("Agreement") is a legally binding contract between you ("User" or "you") and Passage Virtual, LLC ("Platform," "we," or "us") governing your use of the Passage website, mobile application, and related services (collectively, the "Service"). By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by the terms and conditions of this Agreement. If you do not agree to these terms, you may not use the Service.</p>

            <div className="sub_heading">Account Registration</div>
            <p className="text_content">1.1 Eligibility: By creating an account on the Platform, you represent and warrant that you are at least 13 years old. If you are under the age of 13, you may not use the Service without the consent and supervision of a parent or legal guardian.</p>
            <p className="text_content">1.2 Account Information: You agree to provide accurate and complete information during the registration process and to keep your account information updated. You are responsible for maintaining the confidentiality of your account credentials and for any activities that occur under your account.</p>

            <div className="sub_heading">User Content</div>
            <p className="text_content">2.1 Ownership: You retain ownership of any content, including text, photos, videos, and other materials ("User Content"), that you post or share on the Platform. By posting User Content, you grant the Platform a non-exclusive, worldwide, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the User Content in connection with the Service.</p>
            <p className="text_content">2.2 Responsibility: You are solely responsible for your User Content and the consequences of posting or sharing it on the Platform. You agree not to post or share any User Content that is unlawful, defamatory, obscene, invasive of privacy, infringing on intellectual property rights, or otherwise objectionable.</p>
            <p className="text_content">2.3 Monitoring and Removal: The Platform reserves the right to monitor, moderate, and remove any User Content that violates this Agreement or is deemed inappropriate, without prior notice.</p>

            <div className="sub_heading">Prohibited Activities</div>
            <p className="text_content">You agree not to engage in any of the following activities:</p>

            <p className="text_content">3.1 Violation of Law: Use the Service for any illegal purpose or in violation of any applicable laws or regulations.</p>
            <p className="text_content">3.2 Unauthorized Access: Attempt to gain unauthorized access to the Service, other users' accounts, or any computer systems or networks associated with the Service.</p>
            <p className="text_content">3.3 Interference: Interfere with or disrupt the integrity or performance of the Service or the data contained therein.</p>
            <p className="text_content">3.4 Spamming and Solicitation: Engage in spamming, unsolicited advertising, or any other form of solicitation through the Service.</p>
            <p className="text_content">3.5 Impersonation: Impersonate any person or entity or falsely represent your affiliation with any person or entity.</p>

            <div className="sub_heading">Intellectual Property Rights</div>
            <p className="text_content">4.1 Platform Content: The Platform and its licensors retain all intellectual property rights in the Service, including but not limited to the software, trademarks, logos, and other content and materials provided on or through the Service.</p>
            <p className="text_content">4.2 Limited License: Subject to your compliance with this Agreement, the Platform grants you a limited, non-exclusive, non-transferable, and revocable license to access and use the Service for your personal, non-commercial purposes.</p>

            <div className="sub_heading">Privacy</div>
            <p className="text_content">5.1 Privacy Policy: Your use of the Service is subject to our Privacy Policy, which governs the collection, use, and disclosure of your personal information. By using the Service, you consent to the collection and processing of your personal information as described in the Privacy Policy.</p>

            <div className="sub_heading">Termination</div>
            <p className="text_content">6.1 Termination by User: You may terminate your account at any time by following the instructions provided on the Platform. Upon termination, your User Content may no longer be accessible through the Service, but may persist in backup copies for a reasonable period.</p>
            <p className="text_content">6.2 Termination by Platform: The Platform may suspend or terminate your account or access to the Service, with or without cause, at any time and without prior notice.</p>

            <div className="sub_heading">Disclaimer of Warranties</div>
            <p className="text_content">THE SERVICE IS PROVIDED "AS IS" AND WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE PLATFORM DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>

            <div className="sub_heading">Limitation of Liability</div>
            <p className="text_content">IN NO EVENT SHALL THE PLATFORM, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT OR YOUR USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE LOSSES, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY.</p>

            <div className="sub_heading">Governing Law and Jurisdiction</div>
            <p className="text_content">This Agreement shall be governed by and construed in accordance with the laws of Delaware. Any legal action or proceeding arising out of or relating to this Agreement shall be brought exclusively in the courts of Delaware, and you consent to the personal jurisdiction of such courts.</p>

            <div className="sub_heading">Amendments</div>
            <p className="text_content">The Platform reserves the right to modify or update this Agreement at any time, and any changes will be effective upon posting the revised version on the Platform. Your continued use of the Service after any such changes constitutes your acceptance of the revised Agreement.</p>

            <div className="sub_heading">Miscellaneous</div>
            <p className="text_content">If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable to the fullest extent permitted by law. This Agreement constitutes the entire agreement between you and the Platform concerning the subject matter hereof and supersedes any prior or contemporaneous agreements, communications, or understandings, whether written or oral.</p>

            <p className="text_content">By using Passage, you acknowledge that you have read, understood, and agree to be bound by this Agreement.</p>

          </div>
        </div>


      </Row>
    </>
  );
}

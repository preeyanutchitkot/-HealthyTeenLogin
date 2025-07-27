"use client";

import BottomMenu from "@/app/line/components/menu";

export default function AgreementPage() {
  const privacyText = (
    <>
      หากคุณต้องการความช่วยเหลือ ติดต่อเราได้ที่
    </>
  );

  return (
    <div className="wrapper">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .wrapper {
          min-height: 100vh;
          background-color: #ffffff;
          font-family: 'Noto Sans Thai', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .header {
          background-color: #3ABB47;
          color: white;
          width: 100%;
          text-align: center;
          padding: 16px;
          font-size: 18px;
          font-weight: bold;
        }

        .content {
          margin-top: 12px;
          padding: 0 20px;
          color: #333;
          font-size: 14px;
          text-align: center;
          width: 100%;
        }

        .link {
          color: #3ABB47;
          text-decoration: underline;
        }

        .image-container {
          margin: 20px 20px 16px;
          width: 100%;
        }

        .image-container img {
        width: 180px;
        height: auto;
        display: block;
        margin-left: auto;
        margin-right: auto;
        }


        .social-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: calc(100% - 40px);
          margin: 10px 20px;
        }

        .social-buttons a {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 12px;
          background-color: white;
          border: 1.5px solid #3ABB47;
          border-radius: 12px;
          font-weight: bold;
          color: #3ABB47;
          text-decoration: none;
          font-size: 16px;
        }

        .social-buttons a img {
          margin-right: 10px;
          width: 22px;
          height: 22px;
        }

        .bottom {
          margin-top: auto;
          width: 100%;
        }
      `}</style>

      {/* 🟩 Header */}
      <div className="header">Healthy Teen</div>

      {/* 📝 Content */}
      <div className="content">{privacyText}</div>

      {/* 🖼 Image */}
      <div className="image-container">
        <img src="/doctor.png" alt="contact" />
      </div>

      {/* 🔗 Social Buttons */}
      <div className="social-buttons">
        <a href="https://line.me">
          <img src="/line.png" alt="Line" />
          LINE @696kpmzu
        </a>
        <a
          href="https://www.facebook.com/nursing.sut"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/facebook.png" alt="Facebook" />
          Facebook Nursing SUT 
        </a>
      </div>

      {/* 📱 Bottom Menu */}
      <div className="bottom">
        <BottomMenu />
      </div>
    </div>
  );
}

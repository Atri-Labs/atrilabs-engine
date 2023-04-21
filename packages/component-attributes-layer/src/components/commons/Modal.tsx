function Modal(props: any) {
  return (
    <>
      <style>
        {`   .modal-content {
                position: relative;
                background-color: #fefefe;
                margin: auto;
                padding: 0;
                border: 1px solid #888;
                width: 80%;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
                animation-name: animatetop;
                animation-duration: 0.4s;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
              .modal-footer {
                padding: 2px 16px;
                background-color: #5cb85c;
                color: white;
              }
              .modal-body {padding: 2px 16px;}
              .modal-header {
                padding: 2px 16px;
                background-color: #5cb85c;
                color: white;
              }
              .close {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
              }
              
              .close:hover,
              .close:focus {
                color: black;
                text-decoration: none;
                cursor: pointer;
              }
              body:after {
                position: absolute;
                content: '';
                left: 0;
                top: 0;
                height: 100vh;
                width: 100vw;
                background: rgba(0,0,0,0.5);
                /* visibility: hidden; */
                z-index: 0;
            }
            body:after {
                position: absolute;
                content: '';
                left: 0;
                top: 0;
                height: 100vh;
                width: 100vw;
                background: rgba(0,0,0,0.5);
                z-index: 0;
            }

            .modal-content{
                position:fixed !important;
                top:50%;
                left:50%;
                transform: translate(-50%, -50%);
                z-index: 1; 
                width:800px;
                height:800px;
                border-radius: 5px;
                box-sizing: border-box;

            }
            .modal-header{
              background-color: transparent;
              padding: 16px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom:1px solid #dee2e6;
            }
            .modal-footer{
              background-color: transparent; 
              padding-top: 16px;
              border-top: 1px solid #dee2e6 ;
              padding:16px;
              display:flex;
              gap:10px;
              justify-content:end;
            }
            .modal-header h2{
              color: black;
              margin: 0;
              font-size:20px;
              font-weight:500;
            }
            .modal-body{
              padding: 0px;
            }
            .modal-content .modal-body .cm-theme-light{
              height: 660px;
              overflow-y: scroll;
            }
            .modal-content .error .cm-theme-light {
              height: 620px ! important;
              overflow-y: scroll;
          }
            .modal-footer .disabled{
              background-color:#efefef !important;
              cursor: not-allowed;
              color: gray !important;
              border: none;
              height: 38px;
              border-radius: 5px;
              font-size: 16px;
            }
            .modal-footer button:first-child{
              background: #007bff;
              color: #ffffff;
              border: none;
              height: 38px;
              border-radius: 5px;
              font-size: 16px;
            }
            .modal-footer button:last-child{
              background: #6c757d;
              color: #ffffff;
              border: none;
              width: 75px;
              height: 38px;
              border-radius: 5px;
              font-size: 16px;
            }
              `}
      </style>

      {props.showModal && (
        <div className="modal-content">
          <div className="modal-header">
            <h2>{props.title}</h2>
            <span className="close" onClick={() => props.setShowModal(false)}>
              &times;
            </span>
          </div>
          <div className="modal-body" >{props.children}</div>
          <div className="modal-footer">
            {props.footer}
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;

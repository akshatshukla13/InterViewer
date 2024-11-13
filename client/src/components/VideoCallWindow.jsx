import React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router-dom";
import { Rnd } from "react-rnd";
import '../index.css'
function VideoCallWindow() {
  const { roomId } = useParams();

  const myMeeting = async (element) => {
    const appId = Number(import.meta.env.VITE_APP_ID);
    const serverSecret = import.meta.env.VITE_SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId,
      Date.now().toString(),
      "UserName123"
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: element,
      scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
    });
  };

  return (
    <Rnd
      default={{
        x: window.innerWidth - 670,  
        y: 0,  
        width: 320, 
        height: 200,  
      }}
      minWidth={300}  
      minHeight={200}  
      bounds="window"  
      className="drag-resize-container"
      style={{
        border: "2px solid #ae7aff",
        borderRadius: "8px",
      }}
    >
      <div
        ref={myMeeting}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
        }}
      />
    </Rnd>
  );
}

export default VideoCallWindow;

import React from 'react';

export default ({profileData, heartRateData, intradayHeartRateData, logOutButtonHandler, downloadHandler}) => {

  return (
    <>
      <h3>Hello {profileData.displayName}</h3>
      <p>
        HeartRate 
        <button 
          onClick={(e) => {
            downloadHandler(heartRateData,"heartRate");
          }}
        > Download HeartRate</button>
      </p>
      <p>
        IntradayHeartRate 
        <button 
          onClick={(e) => {
            downloadHandler(intradayHeartRateData,"itradayHeartRate");
          }}
        > Download Intraday HeartRate</button>
      </p>
      <a 
        onClick={(e) => {
          logOutButtonHandler(e);
        }} 
      >Logout</a>
    </>
  );
}
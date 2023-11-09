import "./App.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { mockProfileData } from './mockData/mockData';
import { getOrRenewAccessToken } from './components/api/api';
import SignIn from './components/sign-in/SignIn';
import Dashboard from './components/dashboard/Dashboard'

function App() {
  const [loginShown, setLoginShown] = useState(true);
	//Data States
	const [profileData, setProfileData] = useState('');
  const [heartRateData, setHeartRateData] = useState('');
  const [intradayHeartRateData, setIntradayHeartRateData] = useState('');

	const logOutButtonHandler = (e) => {
		e.preventDefault();
		localStorage.clear();
		setLoginShown(true);
		// window.location.href = 'https://jamasp.web.app/';
    window.location.href = 'http://localhost:3000/';
	};
  const loginGuestHandler = (e) => {
		e.preventDefault();
		setLoginShown(false);
		setProfileData(mockProfileData.user);
	};

  useEffect(() => {
		const accessToken = localStorage.getItem('access_token');
		const lastSavedTime = localStorage.getItem('last_saved_time');
		let code_verifier = localStorage.getItem("code_verifier");

		if (
			!accessToken &&
			window.location.href === 'https://jamasp.web.app/'
		) {
			//local testing
			// if (!accessToken && window.location.href === 'http://localhost:3000/') {
			return console.log('nocode');
		} else if (accessToken && Date.now() - lastSavedTime > 28800000) {
			//Access token not valid
			let refreshToken = localStorage.getItem('refresh_token');

			if (!refreshToken || !code_verifier) {
				//missing refresh token, clearing localstorage and start accesstoken route
				localStorage.clear();
				alert(`It looks like something is missing. Please try again. ${code_verifier} and ${refreshToken} `);
			}

			//renewing access token
			getOrRenewAccessToken('renew', refreshToken, code_verifier);
			setLoginShown(false);
		} else if (accessToken && Date.now() - lastSavedTime < 28800000) {
			//Usable Access token
			getUserData(accessToken);
			setLoginShown(false);
			console.log('we have the code');
		} else {
			//no access token previously stored, URL is a redirect with code
			if (!accessToken) {
				const searchParams = new URLSearchParams(window.location.search);
				const urlCode = searchParams.get('code');

				if (!urlCode || !code_verifier || code_verifier==='' || urlCode==='') {
					console.log('urlCode: %s , verifier: %s',urlCode,code_verifier);
					alert('Something went wrong please try again.');
					return;
				}

				//getting access code and userData
				const getAccessCode = getOrRenewAccessToken('get', urlCode,code_verifier);
				getAccessCode.then((code) => {
					getUserData(code);
					setLoginShown(false);
				});
			}
		}
	}, []);

	const getUserData = (accessToken) => {
		const config = {
			headers: { Authorization: `Bearer ${accessToken}` },
		};
		const getProfileData = `https://api.fitbit.com/1/user/-/profile.json`;
    const getHeartRateData = `https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json`;
    //const getIntradayHeartrateData = `https://api.fitbit.com/1/user/BPBM4V/activities/heart/date/today/1d/1min.json`;
    //const getIntradayHeartrateData = `https://api.fitbit.com/1/user/BPBM4V/activities/active-zone-minutes/date/today/1d/1min.json`;
    const getIntradayHeartrateData = `https://api.fitbit.com/1/user/-/activities/heart/date/2023-11-06/today/1min.json`;

		//const getLifeTimeData = `https://api.fitbit.com/1/user/-/activities.json`;
		// const getActivitiesList = `https://api.fitbit.com/1/user/-/activities/list.json`;
		// const getRecentActivites = `https://api.fitbit.com/1/user/-/activities/recent.json`;
		//daily summary includes goals
		//const getTodaySummary = `https://api.fitbit.com/1/user/-/activities/date/today.json`;
		//FRIENDS
		//const getFriendInfo = `https://api.fitbit.com/1.1/user/-/friends.json`;
		// weekly stats for distance/steps
		//const get7DaySteps = `https://api.fitbit.com/1/user/-/activities/steps/date/today/7d.json`;
		const requestOne = axios.get(getProfileData, config);
	  const requestTwo = axios.get(getHeartRateData, config);
		const requestThree = axios.get(getIntradayHeartrateData, config);
		// const requestFour = axios.get(get7DaySteps, config);
		// const requestFive = axios.get(getFriendInfo, config);

		axios
			.all([requestOne,requestTwo,requestThree])
			.then(
				axios.spread((...responses) => {
					const responseOne = responses[0];
          const responseTwo = responses[1];
          const responseThree = responses[2];
					setProfileData(responseOne.data.user);
          setHeartRateData(responseTwo.data);
          setIntradayHeartRateData(responseThree.data);
				})
			)
			.catch((errors) => {
				console.log(errors);
			});
	};

  const downloadHandler = (data, fileName) => {
    // create file in browser
    if (fileName === ''){
      fileName = 'output.json';
    }
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
  
    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
  
    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    return;
  };

  return (
    <div className="app">
      {loginShown && <SignIn loginGuestHandler={loginGuestHandler} />}
      {!loginShown && 
        <Dashboard 
          profileData={profileData}
          heartRateData={heartRateData}
          intradayHeartRateData={intradayHeartRateData}
          logOutButtonHandler={logOutButtonHandler}
          downloadHandler={downloadHandler}
        />
      } 
    </div>
  );
}
export default App;
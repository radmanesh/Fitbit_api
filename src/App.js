import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import SideBar from './components/sidebar/SideBar';
import SignIn from './components/sign-in/SignIn';
import { mockProfileData } from './data/mockData';

function App() {
	const [accessToken, setAccessToken] = useState('1st');
	const [userId, setUserId] = useState('1st');
	const [loginShown, setLoginShown] = useState(true);
	const [mainDashInfo, setMainDashInfo] = useState(true);

	const [profileData, setProfileData] = useState('');
	const [weeklyStepsData, setWeeklyStepsData] = useState('');

	const [lifeTimeData, setLifeTimeData] = useState('');
	const [frequentActivities, setFrequentActivities] = useState('');
	const [recentActivites, setRecentActivites] = useState('');
	const [ActiviteGoals, setActiviteGoals] = useState('');
	const [aboutMeButton, setAboutMeButton] = useState(false);

	const mainDashHandler = (e) => {
		e.preventDefault();
		setMainDashInfo(!mainDashInfo);
	};

	const aboutMeButtonHandler = (e) => {
		e.preventDefault();
		setAboutMeButton(!aboutMeButton);
		setMainDashInfo(false);
	};

	const loginGuest = (e) => {
		// window.location.href =
		// 	'https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=22BQSB&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800';

		e.preventDefault();
		setLoginShown(false);
		setProfileData(mockProfileData.user);
		setLifeTimeData(mockProfileData.lifetime);
		setWeeklyStepsData(mockProfileData['activities-steps']);
	};

	useEffect(() => {
		if (window.location.href === 'http://localhost:3000/') {
			// localStorage.setItem('token', 'access_token_code');
			// localStorage.setItem('user', 'user_Id');
			return;
		} else {
			let accessToken = localStorage.getItem('token');
			if (accessToken === null) {
				const url = window.location.href;
				//getting the access token from url
				const access_token_code = url.split('#')[1].split('=')[1].split('&')[0];
				// get the userid
				const user_Id = url.split('#')[1].split('=')[2].split('&')[0];
				setUserId(user_Id);
				setAccessToken(access_token_code);

				// 	// getUserData(user_Id, access_token_code);

				localStorage.setItem('token', access_token_code);
				localStorage.setItem('user', user_Id);
				setLoginShown(false);
			} else {
				const user_Id = localStorage.getItem('user');
				const access_token_code = localStorage.getItem('token');
				setLoginShown(false);
				getUserData(user_Id, access_token_code);
			}
		}
	}, []);

	const getUserData = (user_Id, access_token_code) => {
		const config = {
			headers: { Authorization: `Bearer ${access_token_code}` },
		};

		const getProfileData = `https://api.fitbit.com/1/user/${user_Id}/profile.json`;
		const getLifeTimeData = `https://api.fitbit.com/1/user/${user_Id}/activities.json`;
		const getActivitiesList = `https://api.fitbit.com/1/user/${user_Id}/activities/list.json`;
		const getFrequentActivities = `https://api.fitbit.com/1/user/${user_Id}/activities/frequent.json`;
		const getRecentActivites = `https://api.fitbit.com/1/user/${user_Id}/activities/recent.json`;
		//daily goals

		const getActiviteGoals = `https://api.fitbit.com/1/user/${user_Id}/activities/goals/daily.json`;

		// weekly stats for distance/steps
		// https://api.fitbit.com/1/user/3GTZLF/activities/distance/date/today/7d.json
		const requestOne = axios.get(getProfileData, config);
		const requestTwo = axios.get(getLifeTimeData, config);
		const requestThree = axios.get(getFrequentActivities, config);
		const requestFour = axios.get(getRecentActivites, config);
		const requestFive = axios.get(getActiviteGoals, config);

		axios
			.all([requestOne, requestTwo, requestThree, requestFour, requestFive])
			.then(
				axios.spread((...responses) => {
					const responseOne = responses[0];
					const responseTwo = responses[1];
					const responseThree = responses[2];
					const responseFour = responses[3];
					const responseFive = responses[4];

					setProfileData(responseOne.data.user);
					setLifeTimeData(responseTwo.data.lifetime);
					setFrequentActivities(responseThree.data);
					setRecentActivites(responseFour.data);
					setActiviteGoals(responseFive.data);
					console.log(responseOne.data.user.fullName);
				})
			)
			.catch((errors) => {
				console.log(errors);
			});
	};

	const dataTransfer = (e) => {
		return profileData;
	};

	const buttonDataTest = (e) => {
		e.preventDefault();
		console.log(profileData.user);
	};
	return (
		<div className='App'>
			{loginShown && <SignIn loginGuest={loginGuest} />}
			{!loginShown && (
				<SideBar
					profileData={profileData}
					lifeTimeData={lifeTimeData}
					mainDashHandler={mainDashHandler}
					mainDashInfo={mainDashInfo}
					buttonDataTest={buttonDataTest}
					dataTransfer={dataTransfer}
					aboutMeButtonHandler={aboutMeButtonHandler}
					aboutMeButton={aboutMeButton}
					weeklyStepsData={weeklyStepsData}
				/>
			)}
		</div>
	);
}

export default App;

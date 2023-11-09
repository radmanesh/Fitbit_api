import axios from 'axios';

const serviceBaseUrl = 'https://fitbit-oauth-service2-rxexpcoyba-ue.a.run.app/'
const getTokenUrl = serviceBaseUrl+'getToken'; //'http://getFitbitToken-jw3n47gu5q-uc.a.run.app';
const refershTokenUrl = serviceBaseUrl+'refreshToken'; //'https://refreshFitbitToken-jw3n47gu5q-uc.a.run.app';

async function getOrRenewAccessToken(type, code, verifier) {
	let url;
  url = ((type==='get') ? getTokenUrl : refershTokenUrl) + '/?code=' +
      code + '&code_verifier='+verifier;

	// Use Axios to make a GET request to the endpoint
	const tokenInfo = await axios.get(url);

	// Save tokens to localStorage together with a timestamp
	localStorage.setItem('code', code);
	localStorage.setItem('code_verifier', verifier);
	localStorage.setItem('access_token', tokenInfo.data.access_token);
	localStorage.setItem('refresh_token', tokenInfo.data.refresh_token);
	localStorage.setItem('last_saved_time', Date.now());
	return tokenInfo.data.access_token;
}
export { getOrRenewAccessToken };

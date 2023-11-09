import React, { useEffect, useState } from 'react';
import {generateCodeChallenge,generateRandomString} from './AuthUtils';

// const codeVerifierStorageKey = 'PKCE_code_verifier';
const stateStorageKey = 'ROCP_auth_state';
const authorizationEndpoint = 'https://www.fitbit.com/oauth2/authorize';

const generateAuthCallbackURL = (code_challenge, code_state) => {
	const params = new URLSearchParams({
		response_type: 'code',
		//client_id: '23RDRW',
		client_id: '23RHP3',
		//redirect_uri: 'http://localhost:3000/fitbit_callback',
		code_challenge: code_challenge,
		code_challenge_method: 'S256',
		state: code_state,
		scope: 'activity cardio_fitness electrocardiogram heartrate location nutrition oxygen_saturation profile respiratory_rate settings sleep social temperature',
	});
	return `${authorizationEndpoint}?${params.toString()}`;
}

export default ({ loginGuestHandler }) => {
	const [callbackURL,setCallbackURL] = useState('');
	
	useEffect(() => {
		const code_verifier = localStorage.getItem("code_verifier");
		const code_state = localStorage.getItem("code_state");
		const code_challenge = localStorage.getItem("code_challenge");
		const last_code_update = localStorage.getItem("last_code_challenge_at");
		// const code = localStorage.getItem("code");
		if (!code_verifier || code_verifier=== '' || (code_verifier!=='' && Date.now() - last_code_update > 288000) ){
			const codeVerifier = generateRandomString(96);
			localStorage.setItem("code_verifier", codeVerifier);
			generateCodeChallenge(codeVerifier).then((codeChallenge) => {
				//console.log(codeVerifier,codeChallenge);
				localStorage.setItem("code_challenge", codeChallenge);
				localStorage.setItem("last_code_challenge_at", Date.now());
				const newCodeState = generateRandomString(32);
				sessionStorage.setItem(stateStorageKey, newCodeState);
				localStorage.setItem("code_state", newCodeState);
				const generatedCallbackURL = generateAuthCallbackURL(codeChallenge, codeVerifier);
				console.log(`just before calling setCAllBackURL(), callbackURL: ${generatedCallbackURL}`);
				setCallbackURL(generatedCallbackURL);
			});
		}else{ // check if we have code_verifier but no callbackURL
			if(!callbackURL){
				console.log('There is no callBackURL and we have code_verifier, so we call setCallBackURL');
				setCallbackURL(generateAuthCallbackURL(code_challenge,code_state));
			}
		}

	}, [callbackURL] );


	return (
		<div className="fitbit-signin-container">
			<a className="fitbit-signin-button-link" href={callbackURL} >
				Login to Fitbit
			</a>
		</div>
	);
};

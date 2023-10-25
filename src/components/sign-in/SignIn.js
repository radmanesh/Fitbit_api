import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {generateCodeChallenge,generateRandomString} from './AuthUtils';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	susbmit: {
		margin: theme.spacing(3, 0, 2),
	},
	fitbitSubmit: {
		color: 'white',
		textDecoration: 'none',
	},
}));

// const codeVerifierStorageKey = 'PKCE_code_verifier';
const stateStorageKey = 'ROCP_auth_state';
const authorizationEndpoint = 'https://www.fitbit.com/oauth2/authorize';

const generateAuthCallbackURL = (code_challenge, code_state) => {
	const params = new URLSearchParams({
		response_type: 'code',
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
	const classes = useStyles();
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
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}></Avatar>
				<Typography component='h1' variant='h5'>
					Login with Fitbit
				</Typography>
				<Button
					type='submit'
					fullWidth
					variant='contained'
					color='primary'
					className={classes.submit}
				>
					<a
						className={classes.fitbitSubmit}
						href={callbackURL}
					>
						Login to Fitbit
					</a>
				</Button>
				<Button
					type='submit'
					fullWidth
					variant='contained'
					color='primary'
					className={classes.submit}
					onClick={(e) => loginGuestHandler(e)}
				>
					Continue as Guest
				</Button>
			</div>
		</Container>
	);
};

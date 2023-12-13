import { Section } from './components';
import Container from '../container';
import { useClickRef } from '@make-software/csprclick-ui';
import MultisigDeploy from './components/MultisigDeploy';

export const LandingBrief = () => {
	return (
		<Container>
			<h3>Sign in</h3>
			<Section>
				<span>
					Sign in with your favorite wallet. Or, click here:
					<b
						onClick={event => {
							event.preventDefault();
							window.csprclick.signIn();
						}}
					>
						{' '}
						Connect
					</b>
					.
				</span>
			</Section>
		</Container>
	);
};

export const SignedInBrief = () => {

	const clickRef = useClickRef();

	const handleSignMessage = async () => {
		const tbs = "Hello Torus user!";
		const signingKey = await clickRef?.getActivePublicKey() || '';

		const result = await clickRef?.signMessage(tbs, signingKey )
		console.info("RESULT", result);
		return false;
	}

	return (
		<Container>
			<h3>Sign a message</h3>
			<Section>
				<button onClick={() => handleSignMessage()}>Sign message</button>
			</Section>
			<h3>Sign a multisig deploy</h3>
			<Section>
				<MultisigDeploy />
			</Section>
		</Container>
	);
};

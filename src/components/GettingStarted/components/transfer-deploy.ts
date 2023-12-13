import { CLPublicKey, DeployUtil } from 'casper-js-sdk';

export function makeTransferDeploy(
	senderPublicKeyHex = '0202e99759649fa63a72c685b72e696b30c90f1deabb02d0d9b1de45eb371a73e5bb',
	recipientPublicKeyHex = '0202c59bcfa794623fd8252dd7ff20498ae3aa71baedd749e8ff0eebfac93c0fe640',
	amountMotes = '5000000000',
	chainName = 'casper-test'
) {
	const senderPublicKey = CLPublicKey.fromHex(senderPublicKeyHex?.toLowerCase() || '');
	const recipientPublicKey = CLPublicKey.fromHex(recipientPublicKeyHex);

	const deployParams = new DeployUtil.DeployParams(senderPublicKey, chainName);

	const session = DeployUtil.ExecutableDeployItem.newTransfer(
		amountMotes,
		recipientPublicKey,
		undefined,
		'1' // transfer id
	);

	const payment = DeployUtil.standardPayment('100000000');

	return DeployUtil.makeDeploy(deployParams, session, payment);
}

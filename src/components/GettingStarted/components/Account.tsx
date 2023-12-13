import { useEffect } from 'react';
import { Section } from './Section';
import { useClickRef } from '@make-software/csprclick-ui';
import Prism from 'prismjs';
import styled from 'styled-components';

export const StyledTD = styled.td(({theme}) =>
	theme.withMedia({
		fontWeight: '600',
		margin: '4px 15px 4px 0',
		display: 'block',
	})
);

export const SpanTruncated = styled.span(({ theme }) =>
	theme.withMedia({
		display: 'inline-block',
		fontFamily: 'JetBrains Mono',
		width: ['150px', '350px', '100%'],
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	})
);

const UserAccount = () => {
	const clickRef = useClickRef();
	const activeAccount = clickRef?.getActiveAccount();
	return (
		<table>
			<tbody>
			<tr>
				<StyledTD>Public key:</StyledTD>
				<td>
					<SpanTruncated>{activeAccount?.public_key}</SpanTruncated>
				</td>
			</tr>
			<tr>
				<StyledTD>Provider:</StyledTD>
				<td>{activeAccount?.provider}</td>
			</tr>
			</tbody>
		</table>
	);
};

export const Account = () => {
	useEffect(() => {
		Prism.highlightAll();
	}, []);

	return (
		<>
			<Section>
				<span>
					Use <code>useClickRef()</code> hook to get a reference to the CSPR.click SDK instance. With this instance you
					easily can get an access to user&apos;s active account with all information: such as public key, provider, etc.
					You can use it to display relevant users data as in example below:
				</span>
			</Section>
			<Section>
				<pre>
					<code className={'language-javascript'}>
						{`const UserAccount = () => {
  const clickRef = useClickRef()
  const activeAccount = clickRef?.getActiveAccount()
    return (
      <table>
        <tr><td>Public key:</td><td>{activeAccount.public_key}</td></tr>
        <tr><td>Provider:</td><td>{activeAccount.provider}</td></tr>
      </table>  
    )`}
					</code>
				</pre>
			</Section>
			<Section withBackground>
				<UserAccount />
			</Section>
		</>
	);
};

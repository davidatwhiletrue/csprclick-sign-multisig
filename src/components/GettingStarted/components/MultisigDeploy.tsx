import { makeTransferDeploy } from './transfer-deploy';

import {
  CLPublicKey,
  DeployUtil,
} from "casper-js-sdk";
import styled from "styled-components";
import { Deploy } from "casper-js-sdk/dist/lib/DeployUtil";
import { useEffect, useState } from "react";
import { useClickRef } from "@make-software/csprclick-ui";

const SignButton = styled.button(() => ({
  marginTop: "12px",
  fontSize: "14px",
  width: "176px",
  height: "24px"
}));

function MultisigDeploy() {
  const clickRef = useClickRef();

  const [multisigDeploy, setMultisigDeploy] = useState<object>();

  useEffect(() => {
    const deploy = localStorage.getItem("savedDeploy");
    if(!deploy) {
        const transferDeploy = makeTransferDeploy();
        setMultisigDeploy(DeployUtil.deployToJson(transferDeploy));

    } else {
        setMultisigDeploy(JSON.parse(deploy));
    }
  }, []);

  const resetMultisigDeploy = () => {
    const transferDeploy = makeTransferDeploy();
    const jsonDeploy = DeployUtil.deployToJson(transferDeploy);
    
    setMultisigDeploy(jsonDeploy);
    localStorage.setItem('savedDeploy', JSON.stringify(jsonDeploy));

    console.log("Reset deploy", jsonDeploy)
  }

  const signAndSend = async (deploy: Deploy) => {
	const signingKey = await clickRef?.getActiveAccount();
    const jsonDeploy = DeployUtil.deployToJson(deploy);

      // @ts-ignore
      window.csprclick
        .sign(JSON.stringify(jsonDeploy.deploy), signingKey?.public_key  || '')
        .then(async (res: any) => {
            console.info(res);
          if (!res) return;
          if (res.cancelled) {
            alert("Sign cancelled");
            return;
          }
          if (res.error) {
            alert("Error: " + res.error);
          } else {
            const signedDeploy = DeployUtil.setSignature(
              deploy,
              res.signature.slice(1, 65),
              CLPublicKey.fromHex(signingKey?.public_key || '')
            );

            // save signed deploy in storage to continue adding signatures from other keys
            //
            const jsonDeploy = DeployUtil.deployToJson(signedDeploy)
            console.info(
              "Signed deploy",
              jsonDeploy
            );
            localStorage.setItem("savedDeploy", JSON.stringify(jsonDeploy));
            setMultisigDeploy(jsonDeploy);

            // validate deploy signatures
            //
            const result = DeployUtil.validateDeploy(signedDeploy);
            if (result.err) {
              alert("Signature could not be verified! " + result.val);
            } else {
              console.log("Valid deploy");
              return;
            }
          }
        })
        .catch((err: any) => {
          alert("Error: " + err);
          throw err;
        });
  }

  const handleSignMultisig = async () => {
      const deployObj = DeployUtil.deployFromJson(multisigDeploy);
      if(deployObj.ok) {
        signAndSend(deployObj.val)
      } else {
        console.error("Deploy not valid", deployObj.err);
      }
  }


  return (
    <>        
        Click on the button to add more Approvals to a deploy
        <SignButton onClick={() => handleSignMultisig()}>
            Add more approvals
        </SignButton>
        <SignButton onClick={() => resetMultisigDeploy()} >
            Reset
        </SignButton>
    </>
  )
}

export default MultisigDeploy;

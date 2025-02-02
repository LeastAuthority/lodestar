import {config} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import {AttesterSlashing, ProposerSlashing} from "@chainsafe/eth2.0-types";
import {generateEmptyBlock} from "./block";
import {getTemporaryBlockHeader} from "@chainsafe/eth2.0-state-transition";
import {generateEmptyAttestation} from "./attestation";


export function generateEmptyProposerSlashing(): ProposerSlashing {

  return {
    signedHeader1: {message: getTemporaryBlockHeader(config, generateEmptyBlock()), signature: Buffer.alloc(96)},
    signedHeader2: {message: getTemporaryBlockHeader(config, generateEmptyBlock()), signature: Buffer.alloc(96)},
    proposerIndex: 0
  };
}

export function generateEmptyAttesterSlashing(): AttesterSlashing {

  return {
    attestation1: {
      data: generateEmptyAttestation().data,
      signature: generateEmptyAttestation().signature,
      attestingIndices: []
    },
    attestation2: {
      data: generateEmptyAttestation().data,
      signature: generateEmptyAttestation().signature,
      attestingIndices: []
    },
  };
}

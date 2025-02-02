/**
 * @module db/api/beacon
 */

import {
  BeaconState,
  BLSPubkey,
  ValidatorIndex,
  Root,
  SignedBeaconBlock,
} from "@chainsafe/eth2.0-types";

import {
  AttestationRepository,
  AttesterSlashingRepository,
  BlockRepository,
  ChainRepository,
  DepositRepository,
  MerkleTreeRepository,
  ProposerSlashingRepository,
  StateRepository,
  VoluntaryExitRepository,
  AggregateAndProofRepository
} from "./repositories";
import {BlockArchiveRepository} from "./repositories/blockArchive";

/**
 * The DB service manages the data layer of the beacon chain
 * The exposed methods do not refer to the underlying data engine,
 * but instead expose relevent beacon chain objects
 */
export interface IBeaconDb {

  chain: ChainRepository;

  state: StateRepository;

  block: BlockRepository;

  blockArchive: BlockArchiveRepository;

  attestation: AttestationRepository;

  aggregateAndProof: AggregateAndProofRepository;

  voluntaryExit: VoluntaryExitRepository;

  proposerSlashing: ProposerSlashingRepository;

  attesterSlashing: AttesterSlashingRepository;

  deposit: DepositRepository;

  merkleTree: MerkleTreeRepository;
  /**
   * Returns validator index coresponding to validator
   * public key in registry,
   * @param publicKey
   */
  getValidatorIndex(publicKey: BLSPubkey): Promise<ValidatorIndex | null>;

  /**
   * Stores block and state and set them as chain head
   */
  storeChainHead(
    block: SignedBeaconBlock,
    state: BeaconState
  ): Promise<void>;

  /**
   * Fetches block and state by root and sets them as chain head
   * @param blockRoot
   * @param stateRoot
   */
  updateChainHead(
    blockRoot: Root,
    stateRoot: Root
  ): Promise<void>;
}

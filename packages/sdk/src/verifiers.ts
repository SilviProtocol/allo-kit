import { Address } from "viem";

export interface VerifierUserData {
  [key: string]: any;
}

export interface Verifier {
  type: string;
  contracts: Record<number, Address>;
  data: (data: VerifierUserData) => string;
  userdata: (data: VerifierUserData) => string;
}

export const verifiers: Record<string, Verifier> = {
  // Add verifiers as needed
};

import type { ProgressStep } from "@arcana/ca-sdk";

export const getTextFromStep = (step: ProgressStep): string => {
  switch (step.type) {
    case "FAUCET_REQUEST":
      return `Requesting funds for ERC20 approvals`;
    case "FAUCET_RECEIVED":
      return `Faucet funds received`;
    case "ALLOWANCE_USER_APPROVAL":
      return `Allowance approved on ${
        (step.data as { chainName: string }).chainName
      }`;
    case "ALLOWANCE_APPROVAL_MINED":
      return `Allowance verified on ${
        (step.data as { chainName: string }).chainName
      }`;
    case "ALLOWANCE_ALL_DONE":
      return "Allowances approved";
    case "INTENT_ACCEPTED":
      return "User accepted the intent and associated fees";
    case "INTENT_HASH_SIGNED":
      return "User signed the intent hash";
    case "INTENT_SUBMITTED":
      return `Intent submitted to the chain: Link - ${
        (step.data as { explorerURL: string }).explorerURL
      }`;
    case "INTENT_COLLECTION":
      return `Intent collected on the chain ${
        (step.data as { confirmed: number })?.confirmed
      }/${(step.data as { total: number })?.total}`;
    case "INTENT_MINED":
      return "Intent mined on the chain";
    case "INTENT_DEPOSIT":
      return `Deposited ${(
        step.data as { amount: string; chainName: string }
      )?.amount.substring(0, 8)} on ${
        (step.data as { amount: string; chainName: string })?.chainName
      }`;
    case "INTENT_DEPOSITS_CONFIRMED":
      return "Deposits confirmed";
    case "INTENT_FULFILLED":
      return "Intent is fulfilled";
    default:
      return step.type;
  }
};

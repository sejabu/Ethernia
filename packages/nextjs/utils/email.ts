// utils/email.ts
import validator from "validator";

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// utils/wallet.ts
export const validateWalletAddress = (address: string): boolean => {
  // Basic validation for Ethereum addresses
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const shortenWalletAddress = (address: string): string => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};
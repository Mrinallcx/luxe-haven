import { apiRequest } from "./api";

// Request OTP API types
export interface RequestOtpPayload {
  emailId: string;
}

export interface RequestOtpResponse {
  message: string;
  otpValidTill: number;
  otpGenerationBlockedTill: number;
}

// Verify OTP API types (placeholder - update when backend endpoint is confirmed)
export interface VerifyOtpPayload {
  emailId: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  token: string;
  user: {
    emailId: string;
    blockchainId: string;
    // Add more user fields as needed
  };
}

/**
 * Request OTP for sign in/sign up
 */
export async function requestOtp(emailId: string) {
  return apiRequest<RequestOtpResponse>("/auth/request-otp", {
    method: "POST",
    body: JSON.stringify({ emailId }),
  });
}

/**
 * Verify OTP and complete sign in
 * NOTE: Update endpoint when backend confirms the actual path
 */
export async function verifyOtp(emailId: string, otp: string) {
  return apiRequest<VerifyOtpResponse>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ emailId, otp }),
  });
}


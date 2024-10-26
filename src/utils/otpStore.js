const otpStore = {};

export const addOTP = (email, otp, expiresAt) => {
  otpStore[email] = { otp, expiresAt };
  console.log("check otp ",otpStore );
};

export const verifyOTP = (email, otp) => {
  const otpData = otpStore[email];
  if (otpData && otpData.otp === otp && Date.now() < otpData.expiresAt) {
    delete otpStore[email]; 
    return true;
  }
  
  return false;
};

export const removeOTP = (email) => {
  delete otpStore[email];
};

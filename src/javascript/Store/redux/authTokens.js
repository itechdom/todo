//SIDE EFFECTS
//MAYBE MAKE THEM INTO THUNKS?
export function storeAccessToken(token) {
  if (token) {
    localStorage.setItem("accessToken", token);
  }
}

export function getAccessToken() {
  let storedToken = localStorage.getItem("accessToken");
  return storedToken;
}

export function storeRefreshToken(token) {
  if (token) {
    localStorage.setItem("refreshToken", token);
  }
}

export function getRefreshToken() {
  let storedToken = localStorage.getItem("refreshToken");
  return storedToken;
}
//END SIDE EFFECTS

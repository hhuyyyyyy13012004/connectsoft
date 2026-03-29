export const AUTH_USER_UPDATED_EVENT = "auth:user-updated";

export const getStoredUserName = () =>
  localStorage.getItem("userName")?.trim() || "";

export const getStoredUserId = () => localStorage.getItem("userId")?.trim() || "";

export const getStoredToken = () => localStorage.getItem("token")?.trim() || "";

export const getStoredAvatarUrl = () =>
  localStorage.getItem("avatarUrl")?.trim() || "";

export const setStoredUserName = (userName) => {
  const normalizedUserName = userName?.trim() || "";

  if (normalizedUserName) {
    localStorage.setItem("userName", normalizedUserName);
  } else {
    localStorage.removeItem("userName");
  }

  window.dispatchEvent(
    new CustomEvent(AUTH_USER_UPDATED_EVENT, {
      detail: {
        userName: normalizedUserName,
        avatarUrl: getStoredAvatarUrl(),
      },
    }),
  );
};

export const setStoredUserId = (userId) => {
  const normalizedUserId = userId?.trim() || "";

  if (normalizedUserId) {
    localStorage.setItem("userId", normalizedUserId);
  } else {
    localStorage.removeItem("userId");
  }
};

export const setStoredAvatarUrl = (avatarUrl) => {
  const normalizedAvatarUrl = avatarUrl?.trim() || "";

  if (normalizedAvatarUrl) {
    localStorage.setItem("avatarUrl", normalizedAvatarUrl);
  } else {
    localStorage.removeItem("avatarUrl");
  }

  window.dispatchEvent(
    new CustomEvent(AUTH_USER_UPDATED_EVENT, {
      detail: {
        userName: getStoredUserName(),
        avatarUrl: normalizedAvatarUrl,
      },
    }),
  );
};

export const syncStoredUserNameFromUser = (user) => {
  const nextUserName =
    user?.profile?.fullName || user?.fullName || user?.username || user?.name || "";

  setStoredUserName(nextUserName);
};

export const syncStoredAvatarFromUser = (user) => {
  const nextAvatarUrl = user?.profile?.avatarUrl || user?.avatarUrl || "";
  setStoredAvatarUrl(nextAvatarUrl);
};

export const syncStoredAuthFromUser = (user) => {
  setStoredUserId(user?.id || user?._id || "");
  syncStoredUserNameFromUser(user);
  syncStoredAvatarFromUser(user);
};

export const clearStoredAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("avatarUrl");
  setStoredUserName("");
};

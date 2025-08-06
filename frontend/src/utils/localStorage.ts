export const setAccessToken = (value: string) => {
  localStorage.setItem("access_token", JSON.stringify(value));
};

export const setUserId = (value: number) => {
  localStorage.setItem("id", JSON.stringify(value));
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("access_token");
};


export const getUserId = (): number => {
  return Number(localStorage.getItem("id")) ?? 0;
};

export const removeUserId = (): void => {
  localStorage.removeItem("access_token");
};

export const removeAccessToken = (): void => {
  localStorage.removeItem("id");
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

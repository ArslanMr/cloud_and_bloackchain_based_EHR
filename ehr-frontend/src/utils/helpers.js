export const saveToken = (token) => {
    localStorage.setItem('access_token', token);
}

export const getToken = () => {
    const token = localStorage.getItem('access_token');
    return token;
}
  
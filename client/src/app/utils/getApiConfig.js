const getApiConfig = () => {
  const jwtToken = localStorage.getItem("jwtToken");
  const config = {
    headers: { Authorization: `Bearer ${jwtToken}` },
  };

  return config;
};

export default getApiConfig;

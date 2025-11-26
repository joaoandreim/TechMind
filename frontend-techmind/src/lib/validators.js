export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  export const isValidPassword = (password) => {
    return password && password.length >= 6;
  };
  
  export const isRequired = (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  };
  
  export const getErrorMessage = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message;
    }
    return error.message || 'Ocorreu um erro inesperado.';
  };
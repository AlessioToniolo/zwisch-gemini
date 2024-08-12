export const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };
  
  export const validateSchoolEmail = (email) => {
    // This is a simple check. You might want to implement a more sophisticated validation
    // based on your specific requirements or a list of approved school domains.
    return email.endsWith('.edu');
  };
  
  export const validatePassword = (password) => {
    // Require at least 8 characters, one uppercase letter, one lowercase letter, and one number
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  };
  
  export const validateName = (name) => {
    return name.trim().length > 0;
  };
  
  export const getEmailErrorMessage = (email) => {
    if (!email) return "Email is required";
    if (!validateEmail(email)) return "Invalid email address";
    if (!validateSchoolEmail(email)) return "Please use a valid school email address";
    return "";
  };
  
  export const getPasswordErrorMessage = (password) => {
    if (!password) return "Password is required";
    if (!validatePassword(password)) return "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number";
    return "";
  };
  
  export const getNameErrorMessage = (name) => {
    if (!name) return "Name is required";
    if (!validateName(name)) return "Please enter a valid name";
    return "";
  };
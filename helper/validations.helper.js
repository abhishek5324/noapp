const Validations = {
  isValidName: (name) => {
    const nameRegex = new RegExp(/^[a-zA-Z]{1,15}$/);
    return nameRegex.test(name);
  },

  isValidEmail: (email) => {
    const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    return emailRegex.test(email);
  },

  isValidAge: (age) => {
    return age >= 1 && age <= 120;
  },

  isValidGender: (gender) => {
    const genderLowercase = gender.toLowerCase();
    return genderLowercase === "male" || genderLowercase === "female"
  },
};


module.exports = Validations
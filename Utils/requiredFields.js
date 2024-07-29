const  setRequiredFields= (row)=> {
    // Add 'email' and 'employeeUd' fields as required
    if (!row.email || !row.employeeId) {
      throw new Error("Email and employeeId are required fields");
    }
};
  module.exports = setRequiredFields;
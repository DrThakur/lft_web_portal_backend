const jwt= require('jsonwebtoken')


const createTokenForUsers= (user) =>{

    const payload= {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profileImageURL: user.profileImageURL,
        employeeCode: user.employeeCode,
        reportingManager: user.reportingManager,
        designation: user.designation,
        role: user.role,
        department: user.department,
        location: user.location,
    }
    const token =jwt.sign(payload, process.env.SECRET_STR, {
        expiresIn:process.env.LOGIN_EXPIRES
    }) 

    return token;
}

const validateToken= (token)=> {
    const payload = jwt.verify(token, process.env.SECRET_STR);
    return payload;
  }

  module.exports = {
    createTokenForUsers,
    validateToken
  }
  


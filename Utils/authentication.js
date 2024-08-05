const jwt= require('jsonwebtoken')


const createTokenForUsers= (user) =>{

    const payload= {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profileImageURL: user.profileImageURL,
        employeeId: user.employeeId,
        reportingManager: user.reportingManager,
        designation: user.designation,
        role: user.role,
        department: user.department,
        location: user.location,
        dateOfJoining:user.dateOfJoining,
        dateOfBirth:user.dateOfBirth,
        gender:user.gender,
        maritalStatus:user.maritalStatus,
        religion:user.religion,
        nationality:user.nationality,
        temporaryAddress:user.temporaryAddress,
        permanentAddress:user.permanentAddress,

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
  


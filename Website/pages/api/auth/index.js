import { decodeToken, generateToken } from "../../../utils"
import conn from "../../../utils/db"
import { getEmployee } from "../employee"

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                let token = req.headers.get('authorization')?.split("Bearer ")[1];

                if (token?.trim()) {
                    let employee = decodeToken(token);
                    let result = await conn.query(`select * from employees where "employeeId"= '${employee.employeeId}' and id = '${employee.id}'`);
                    result = result.rows[0]
                    let data = {
                        id: result.id,
                        employeeId: result.employeeId,
                        expiryDate: result.expiryDate,
                        generatedAt: new Date().toISOString()
                    }
                    let token = generateToken(data)
                    res.status(200).send({
                        success: true,
                        message: 'Employee Authorized',
                        token: token
                    })
                }
                else {
                    res.status(401).send({
                        success: false,
                        message: 'Unauthorized'
                    })
                }

            } catch (error) {
                res.status(400).send({
                    success: false,
                    message: error.message
                })
            }
            break;
        case 'POST':
            try {
                if (req.body.type == 'generateOtp') {
                    let employee = await getEmployee({ phoneNumber: req.body.phoneNumber })
                    if (employee) {
                        let data = await generateOtp(employee)
                        res.status(200).send({
                            success: true,
                            message: 'OTP Generated',
                            data: data
                        })
                    }
                    else {
                        res.status(400).send({ success: false, message: 'Employee is not registered' })
                    }
                }
                else if (req.body.type == 'verifyOtp') {
                    let data = await verifyOtp(req.body)
                    res.status(200).send(data)
                }
                else if (req.body.type == 'verifyCredentials') {
                    let data = await verifyCredentials(req.body)
                    res.status(200).send(data)
                }
                else {
                    res.status(400).send({ success: false, message: 'Invalid Request Type' })
                }
            } catch (error) {
                res.status(400).send({ success: false, message: error.message })
            }
            break;
        default:
            res.status(200).json({ name: 'John Doe' })
    }
}

function createOtp() {

    // Declare a digits variable 
    // which stores all digits
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 5; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}


const generateOtp = async (employee) => {
    let time = new Date();
    time.setMinutes(time.getMinutes() + 5);

    let otp = createOtp();
    let data = await conn.query(`insert into otps("employeeId", "phoneNumber" ,"otp", "validUpto") values('${employee.employeeId}', '${employee.phoneNumber}' ,'${otp}','${time.toISOString()}') returning *`);
    return data.rows[0]
}

const verifyOtp = async (data) => {
    let otpData = await conn.query(`select * from otps where "phoneNumber" = '${data.phoneNumber}' and otp = '${data.otp}' order by "updatedAt" desc `)
    otpData = otpData.rows[0]
    if (otpData) {

        if (new Date(otpData.validUpto) > new Date()) {
            await conn.query(`delete from otps where "phoneNumber" = '${data.phoneNumber}'`)
            return {
                success: true,
                message: 'OTP Verified',
            }
        }
        else {
            return {
                success: false,
                message: 'OTP Expired'
            }
        }
    }
    else {
        return {
            success: false,
            message: 'OTP Used'
        }
    }
}

const verifyCredentials = async (data) => {
    let employee = await conn.query(`select id, name, "employeeId", password, "phoneNumber", "expiryDate", "dateOfBirth", email from employees where "employeeId" = '${data.employeeId}'`);
    employee = employee.rows[0]
    if (new Date(employee.expiryDate) > new Date()) {

        if (data.password == employee.password) {
            let { password, ...others } = employee;
            let tokenData = {
                id: others.id,
                employeeId: others.employeeId,
                expiryDate: others.expiryDate,
                generatedAt: new Date().toISOString()
            }
            let token = generateToken(tokenData)
            return {
                success: true,
                message: 'Employee Verified',
                token: token
            }
        }
        else {
            return {
                success: false,
                message: 'Invalid Credentials'
            }
        }
    }
    else {
        return {
            success: false,
            message: 'Employee Access Expired'
        }
    }
}

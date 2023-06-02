import { generateToken } from "../../utils";
import conn from "../../utils/db";

export default async function handler(req, res) {
    switch (req.method) {
        case 'POST':
            try {
                let data = await verifyCredentials(req.body)
                res.status(200).send(data)
            } catch (error) {
                res.status(400).send({ success: false, message: error.message })
            }
            break;
        default:
            res.status(200).json({ name: 'John Doe' })
    }
}


const verifyCredentials = async (data) => {

    let employee = await conn.query(`select id, name, "employeeId", password, "phoneNumber", "expiryDate", "dateOfBirth", email from employees where "email" = '${data.email}' limit 1`)
    employee = employee.rows[0]
    if (employee) {

        if (new Date(employee?.expiryDate) > new Date()) {
            if (data.password == employee?.password) {
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
    else {
        return {
            success: false,
            message: 'Invalid Credentials'
        }
    }
}

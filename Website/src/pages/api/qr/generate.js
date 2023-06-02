import { generateToken } from "../../../utils";
import conn from "../../../utils/db";

export default async function handler(req, res) {
    try {
        let employee = JSON.parse(req.headers.employee)
        let result = await conn.query(`select * from employees where "employeeId"= '${employee.employeeId}' and id = '${employee.id}'`);
        result = result.rows[0]
        let data = {
            id: result.id,
            employeeId: result.employeeId,
            expiryDate: result.expiryDate,
            generatedAt: new Date().toISOString()
        }
        let token = generateToken(data)
        res.send({ success: true, data: token, message: 'QR Generated Successfully' })
    } catch (error) {
        res.status(400).send({ success: false, message: error.message })
    }

}
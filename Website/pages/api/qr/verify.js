import { decodeToken } from "../../../utils";
import conn from "../../../utils/db";

export default async function handler(req, res) {
    try {
        let token = req.headers.authorization?.split("Bearer ")[1];

        if (token?.trim()) {
            let employee = decodeToken(token);
            if (employee.employeeId && employee.id) {
                let date = new Date(employee.generatedAt)
                date.setMinutes(date.getMinutes() + 1)
                // if (new Date(date) > new Date()) {
                    let result = await conn.query(`select * from employees where "employeeId"= '${employee.employeeId}' and id = '${employee.id}'`);
                    result = result.rows[0]
                    let { password, ...others } = result;
                    res.status(200).send({
                        success: true,
                        message: 'Employee Verified',
                        data: others
                    })
                // }
                // else {
                //     res.status(200).send({
                //         success: false,
                //         message: 'QR Code Expired'
                //     })
                // }
            }
            else {
                res.status(400).send({
                    success: false,
                    message: 'Invalid QR Code'
                })
            }
        }
        else {
            res.status(400).send({
                success: false,
                message: 'Invalid QR Code'
            })
        }

    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        })
    }
}
import conn from "../../../utils/db";

function genPassword() {
    var chars =
        "0123456789abcdefghijklmnopqrstuvwxyz-@#$&ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 12;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
}

export default async function updateEmployeePassword(req, res) {
    if (req.method == 'PATCH') {
        try {
            let password = genPassword();
            let sql = `update employees set "password" = '${password}'`
            sql += ` where id = '${req.body.id}' and "employeeId" = '${req.body.employeeId}' returning *`
            let data = await conn.query(sql)
            res.status(200).send({
                success: true,
                message: 'Successfully Updated',
                data: data
            })
        } catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    }
}
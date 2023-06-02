import conn from "../../../utils/db";

let employee = {
    id: 1,
    name: 'Test',
    employeeId: 123456,
    email: 'test@email.com',
    password: 'fufhuifhf',
    phoneNumber: 9848468464,
    expiryDate: new Date().toISOString(),
    dateOfBirth: new Date().toISOString(),
}

let employee2 = {
    "id": 1,
    "name": "Test",
    "employeeId": 123456,
    "email": "test@email.com",
    "phoneNumber": 9848468464,
    "expiryDate": "2023-10-02T05:01:17.437Z",
    "dateOfBirth": "2000-06-02T05:01:17.437Z"
}

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            try {
                if (req.query.employeeId) {
                    let emp = await getEmployee({ employeeId: req.query.employeeId });
                    res.status(200).send({
                        success: true,
                        message: 'Successfully Get',
                        data: emp
                    })
                }
                else {
                    let emps = await getAllEmployees()
                    res.status(200).send({
                        success: true,
                        message: 'Successfully Get',
                        data: emps
                    })
                }
                
            } catch (error) {
                res.status(400).send({ success: false, message: error.message })
            }
            break;
        case "POST":
            try {
                let data = await createEmployee(req.body);
                res.status(201).send({
                    success: true,
                    message: 'Successfully Created',
                    data: data
                })
            } catch (error) {
                res.status(400).send({ success: false, message: error.message })
            }
            break;
        case "PATCH":
            try {
                let data = await updateEmployee(req.body)
                res.status(200).send({
                    success: true,
                    message: 'Successfully Updated',
                    data: data
                })
            } catch (error) {
                res.status(400).send({ success: false, message: error.message })
            }
            break;
        case "DELETE":
            try {
                let data = await removeEmployee(req.query.id);
                res.status(200).send({
                    success: true,
                    message: 'Successfully Deleted',
                    data: data
                })
            } catch (error) {
                res.status(400).send({ success: false, message: error.message })
            }
            break;
        default:
            res.status(200).json({ name: 'John Doe' })
    }
}

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

export const getEmployee = async ({ employeeId, phoneNumber }) => {
    let sql = `select id, name, "employeeId", "phoneNumber", "expiryDate", "dateOfBirth", email from employees where `
    let employee = await conn.query(`${sql} ("employeeId" = '${employeeId || ''}' or "phoneNumber" = ${phoneNumber || null}) and role = 'user'`)
    return employee.rows[0]
}

const getAllEmployees = async () => {
    let employees = await conn.query(`select id, name, "employeeId", "phoneNumber", "expiryDate", "dateOfBirth", email from employees where role = 'user' order by "updatedAt" desc`)
    return employees.rows
}
const createEmployee = async (data) => {
    let password = genPassword();
    let employee = await conn.query(`insert into employees(name, "employeeId", "phoneNumber", "expiryDate", "dateOfBirth", email, password) values('${data.name}', '${data.employeeId}', '${data.phoneNumber}', '${data.expiryDate}', '${data.dateOfBirth}', '${data.email}', '${password}') returning * `)
    return employee.rows[0]
}
const updateEmployee = async (data) => {
    let sql = `update employees set name = '${data.name}', "employeeId" = '${data.employeeId}', "phoneNumber" = '${data.phoneNumber}', "expiryDate" = '${data.expiryDate}', "dateOfBirth" = '${data.dateOfBirth}', email = '${data.email}'`
    sql += ` where id = '${data.id}' and "employeeId" = '${data.employeeId}' returning id, name, "employeeId", "phoneNumber", "expiryDate", "dateOfBirth", email `
    let employee = await conn.query(sql)
    return employee.rows[0]
}

const removeEmployee = async (id) => {
    let employee = await conn.query(`delete from employees where id = '${id}' returning id, name, "employeeId", "phoneNumber", "expiryDate", "dateOfBirth", email `)
    return employee.rows[0]
}

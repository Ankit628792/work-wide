import { NextResponse } from 'next/server';
import { decodeToken } from './utils';

export default async function middleware(req, res) {
    console.log('MIDDLE WARE')
    let token = req.headers.get('authorization')?.split("Bearer ")[1];

    if (token?.trim()) {
        let employee = decodeToken(token);
        const response = NextResponse.next()
        response.headers.append("employee", JSON.stringify(employee))
        return response
    }
    else {
        return NextResponse.json({
            success: false,
            message: 'Unauthorized'
        }, { status: 401 })
    }
}

export const config = {
    matcher: ['/api/employee', '/api/generateQR']
};

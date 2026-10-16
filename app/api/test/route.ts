
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        success: true,
        message: "ASTRIA backend çalışıyor!",
    });
}

export async function POST(request: Request) {
    const data = await request.json();

    if (!data.birthDate) {
        return NextResponse.json(
            {
                success: false,
                message: "Doğum tarihi zorunludur!",
            },
            { status: 400 }
        );
    }

    if (!data.birthTime) {
        return NextResponse.json(
            {
                success: false,
                message: "Doğum saati zorunludur!",
            },
            { status: 400 }
        );
    }

    return NextResponse.json({
        success: true,
        message: "Veri sunucuya ulaştı!",
        receivedData: data,
    });
}

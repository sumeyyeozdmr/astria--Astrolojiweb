
import { NextResponse } from "next/server";
import { Engine } from "caelus";
import { embeddedData } from "caelus/data-embedded";
import { localToChart, type BirthInput } from "caelus-birth";
import { openMeteoGeocoder } from "caelus-birth/geocode";

const engine = new Engine(embeddedData);

export async function GET() {
    return NextResponse.json({
        success: true,
        message: "ASTRIA doğum haritası API'si çalışıyor.",
    });
}

// Popüler Türkiye şehirleri için yerel koordinat ve saat dilimi yedeği (API kesintisi durumunda sıfır hata)
const TURKISH_CITIES: Record<string, { name: string; lat: number; lon: number; timezone: string }> = {
    istanbul: { name: "İstanbul, Türkiye", lat: 41.0082, lon: 28.9784, timezone: "Europe/Istanbul" },
    ankara: { name: "Ankara, Türkiye", lat: 39.9334, lon: 32.8597, timezone: "Europe/Istanbul" },
    izmir: { name: "İzmir, Türkiye", lat: 38.4237, lon: 27.1428, timezone: "Europe/Istanbul" },
    bursa: { name: "Bursa, Türkiye", lat: 40.1885, lon: 29.0610, timezone: "Europe/Istanbul" },
    antalya: { name: "Antalya, Türkiye", lat: 36.8969, lon: 30.7133, timezone: "Europe/Istanbul" },
    adana: { name: "Adana, Türkiye", lat: 37.0000, lon: 35.3213, timezone: "Europe/Istanbul" },
    konya: { name: "Konya, Türkiye", lat: 37.8746, lon: 32.4932, timezone: "Europe/Istanbul" },
    gaziantep: { name: "Gaziantep, Türkiye", lat: 37.0662, lon: 37.3833, timezone: "Europe/Istanbul" },
    sanliurfa: { name: "Şanlıurfa, Türkiye", lat: 37.1674, lon: 38.7955, timezone: "Europe/Istanbul" },
    kocaeli: { name: "Kocaeli, Türkiye", lat: 40.8533, lon: 29.8815, timezone: "Europe/Istanbul" },
    mersin: { name: "Mersin, Türkiye", lat: 36.8121, lon: 34.6415, timezone: "Europe/Istanbul" },
    diyarbakir: { name: "Diyarbakır, Türkiye", lat: 37.9144, lon: 40.2306, timezone: "Europe/Istanbul" },
    hatay: { name: "Hatay, Türkiye", lat: 36.4018, lon: 36.3498, timezone: "Europe/Istanbul" },
    manisa: { name: "Manisa, Türkiye", lat: 38.6191, lon: 27.4289, timezone: "Europe/Istanbul" },
    kayseri: { name: "Kayseri, Türkiye", lat: 38.7205, lon: 35.4826, timezone: "Europe/Istanbul" },
    samsun: { name: "Samsun, Türkiye", lat: 41.2867, lon: 36.3300, timezone: "Europe/Istanbul" },
    balikesir: { name: "Balıkesir, Türkiye", lat: 39.6484, lon: 27.8826, timezone: "Europe/Istanbul" },
    kahramanmaras: { name: "Kahramanmaraş, Türkiye", lat: 37.5858, lon: 36.9371, timezone: "Europe/Istanbul" },
    van: { name: "Van, Türkiye", lat: 38.4891, lon: 43.4089, timezone: "Europe/Istanbul" },
    aydin: { name: "Aydın, Türkiye", lat: 37.8560, lon: 27.8416, timezone: "Europe/Istanbul" },
    denizli: { name: "Denizli, Türkiye", lat: 37.7765, lon: 29.0864, timezone: "Europe/Istanbul" },
    sakarya: { name: "Sakarya, Türkiye", lat: 40.7569, lon: 30.3783, timezone: "Europe/Istanbul" },
    tekirdag: { name: "Tekirdağ, Türkiye", lat: 40.9833, lon: 27.5167, timezone: "Europe/Istanbul" },
    mugla: { name: "Muğla, Türkiye", lat: 37.2153, lon: 28.3636, timezone: "Europe/Istanbul" },
    eskisehir: { name: "Eskişehir, Türkiye", lat: 39.7767, lon: 30.5206, timezone: "Europe/Istanbul" },
    mardin: { name: "Mardin, Türkiye", lat: 37.3212, lon: 40.7245, timezone: "Europe/Istanbul" },
    malatya: { name: "Malatya, Türkiye", lat: 38.3552, lon: 38.3095, timezone: "Europe/Istanbul" },
    erzurum: { name: "Erzurum, Türkiye", lat: 39.9043, lon: 41.2679, timezone: "Europe/Istanbul" },
    trabzon: { name: "Trabzon, Türkiye", lat: 41.0027, lon: 39.7168, timezone: "Europe/Istanbul" },
    sivas: { name: "Sivas, Türkiye", lat: 39.7477, lon: 37.0179, timezone: "Europe/Istanbul" },
    canakkale: { name: "Çanakkale, Türkiye", lat: 40.1553, lon: 26.4142, timezone: "Europe/Istanbul" },
};

function normalizeTurkishLetters(str: string): string {
    return str
        .replace(/İ/g, "I")
        .replace(/ı/g, "i")
        .replace(/Ş/g, "S")
        .replace(/ş/g, "s")
        .replace(/Ğ/g, "G")
        .replace(/ğ/g, "g")
        .replace(/Ü/g, "U")
        .replace(/ü/g, "u")
        .replace(/Ö/g, "O")
        .replace(/ö/g, "o")
        .replace(/Ç/g, "C")
        .replace(/ç/g, "c")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const rawDate = typeof data.birthDate === "string" ? data.birthDate.trim() : "";
        const rawTime = typeof data.birthTime === "string" ? data.birthTime.trim() : "";
        const rawPlace = typeof data.birthPlace === "string" ? data.birthPlace.trim() : "";

        if (!rawDate || !rawPlace || rawPlace.length < 2) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Doğum tarihi, saati ve yeri zorunludur.",
                },
                { status: 400 }
            );
        }

        // Tarih ayrıştırma (YYYY-MM-DD)
        const dateMatch = rawDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (!dateMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Geçerli bir doğum tarihi girin (Örn: 1996-05-14).",
                },
                { status: 400 }
            );
        }

        const year = Number(dateMatch[1]);
        const month = Number(dateMatch[2]);
        const day = Number(dateMatch[3]);

        // Saat ayrıştırma (HH:MM veya HH:MM:SS veya H:MM)
        const timeMatch = rawTime.match(/^(\d{1,2}):(\d{1,2})(?::\d{1,2})?$/);
        const hour = timeMatch ? Number(timeMatch[1]) : 12;
        const minute = timeMatch ? Number(timeMatch[2]) : 0;

        const parsedDate = new Date(Date.UTC(year, month - 1, day));
        if (
            parsedDate.getUTCFullYear() !== year ||
            parsedDate.getUTCMonth() !== month - 1 ||
            parsedDate.getUTCDate() !== day ||
            hour < 0 ||
            hour > 23 ||
            minute < 0 ||
            minute > 59
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Geçerli bir doğum tarihi veya saati gir.",
                },
                { status: 400 }
            );
        }

        // Doğum yerini Open-Meteo servisiyle ara
        const normalizedKey = normalizeTurkishLetters(rawPlace.split(",")[0]);
        let place: { name: string; lat: number; lon: number; timezone?: string } | null = null;

        try {
            const cleanQuery = rawPlace.split(",")[0].trim();
            let places = await openMeteoGeocoder.search(cleanQuery, 5);
            if (places.length === 0 && rawPlace.includes(",")) {
                places = await openMeteoGeocoder.search(rawPlace.trim(), 5);
            }
            if (places.length > 0) {
                place = places[0];
            }
        } catch (searchError) {
            console.warn("Open-Meteo geocoding servisine erişilemedi, yerel veri tabanı denenecek:", searchError);
        }

        // Geocoder bulamazsa veya ağ hatası olursa yerel Türkiye listesinden eşleştir
        if (!place && TURKISH_CITIES[normalizedKey]) {
            place = TURKISH_CITIES[normalizedKey];
        }

        if (!place) {
            // İkinci kelime veya genel anahtar eşleşmesi ara
            const foundKey = Object.keys(TURKISH_CITIES).find(k => normalizedKey.includes(k) || k.includes(normalizedKey));
            if (foundKey) {
                place = TURKISH_CITIES[foundKey];
            }
        }

        if (!place) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Doğum yeri bulunamadı. Şehir ve ülke adını birlikte yazmayı dene (Örn: İstanbul, Türkiye).",
                },
                { status: 404 }
            );
        }

        const birthInput: BirthInput = {
            year,
            month,
            day,
            hour,
            minute,
            lat: place.lat,
            lon: place.lon,
            ...(place.timezone ? { zone: place.timezone } : { zone: "Europe/Istanbul" }),
        };

        // Yerel doğum saatini doğru zaman dilimiyle hesapla
        const result = localToChart(
            birthInput,
            engine,
            "placidus"
        );

        return NextResponse.json({
            success: true,
            message: "Doğum haritası hesaplandı.",
            chart: result.chart,
            birthInfo: {
                birthDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
                birthTime: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
                birthPlace: place.name,
                latitude: place.lat,
                longitude: place.lon,
                timezone: result.zone,
                utc: result.utc,
                offsetMinutes: result.offsetMinutes,
                dst: result.dst,
                timeStatus: result.status,
            },
        });
    } catch (error) {
        console.error("Doğum haritası hesaplama hatası:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    "Harita hesaplanamadı. Bağlantını kontrol edip tekrar dene.",
            },
            { status: 500 }
        );
    }
}

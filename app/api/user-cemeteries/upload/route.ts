import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;
// Allowed formats
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
// Max 10 photos per submission - currently unused but reserved for future validation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MAX_PHOTOS = 10;

// POST: Upload a photo for user cemetery submission
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Je moet ingelogd zijn om foto\'s te uploaden' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Geen bestand gevonden' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Alleen JPG, PNG, WebP en HEIC bestanden zijn toegestaan' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Bestand is te groot (max 10MB)' },
        { status: 400 }
      );
    }

    // Process image with sharp - convert to WebP
    const buffer = Buffer.from(await file.arrayBuffer());

    const processedImage = await sharp(buffer)
      .rotate() // Auto-rotate based on EXIF
      .resize(1600, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: 80,
        effort: 6
      })
      .toBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = crypto.randomBytes(8).toString('hex');
    const fileName = `user-${user.id}-${timestamp}-${randomId}.webp`;

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'user-cemeteries');
    await mkdir(uploadDir, { recursive: true });

    // Save file
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, processedImage);

    // File URL for the form
    const fileUrl = `/uploads/user-cemeteries/${fileName}`;

    return NextResponse.json({
      success: true,
      fileUrl,
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het uploaden' },
      { status: 500 }
    );
  }
}

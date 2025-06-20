import { supabase } from '../../lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

//Unique Ref generator
function generateReferralCode(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

export async function POST(req: Request) {
  const { doctorName, phoneNumber } = await req.json();

  if (!doctorName || !phoneNumber) {
    return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
  }

  const referralCode = generateReferralCode();

  const { error } = await supabase.from('sent_links').insert([
    { doctor_name: doctorName, phone_number: phoneNumber, referral_code: referralCode },
  ]);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const link = `/visit/${encodeURIComponent(doctorName)}?ref=${referralCode}`;
  return NextResponse.json({ success: true, link });
}

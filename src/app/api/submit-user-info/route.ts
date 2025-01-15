import db from '@/app/utils/mongoConnect';
import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const name = formData.get('name') as string;
//     const email = formData.get('email') as string;
//     const rebateNumber = formData.get('rebateNumber') as string;
//     const photo = formData.get('photo') as File;

//     // Save to MongoDB (assuming you have a 'users' collection)
//     const usersCollection = db.collection('users');
//     const result = await usersCollection.insertOne({
//       name,
//       email,
//       rebateNumber,
//       photoUrl: photo ? `/uploads/${photo.name}` : null,
//       createdAt: new Date()
//     });

//     // Generate a confirmation number (e.g., using the MongoDB document ID)
//     const confirmationNumber = result.insertedId.toString();

//     return NextResponse.json({ confirmationNumber }, { status: 201 });
//   } catch (error) {
//     console.error('Error processing form submission:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }


export async function POST(request: Request) {
  console.log('Processing form submission...');
  try {
    const formData = await request.formData();
    console.log('Form data received:', Object.fromEntries(formData));

    const confirmationNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
    return NextResponse.json({ confirmationNumber }, { status: 201 });
  } catch (error) {
    console.error('Error processing form submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
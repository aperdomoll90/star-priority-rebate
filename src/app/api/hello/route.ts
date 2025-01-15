import { NextResponse } from 'next/server'

export async function GET() {
	const headers: Record<string, string> = {
	  'Authorization': `token ${process.env.GITHUB_TOKEN || ''}`,
	};
  
	if (process.env.API_KEY) {
	  headers['API-KEY'] = process.env.API_KEY;
	}
  
	const res = await fetch('https://api.github.com/users/vercel', { headers });
	const data = await res.json();
	return NextResponse.json('test here');
  }
  
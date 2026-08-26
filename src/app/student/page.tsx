import { redirect } from 'next/navigation';

export default function StudentPageRedirect() {
  redirect('/student/dashboard');
}

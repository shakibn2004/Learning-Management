import { redirect } from 'next/navigation';

export default function InstructorPageRedirect() {
  redirect('/instructor/dashboard');
}

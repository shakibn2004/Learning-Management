import { redirect } from 'next/navigation';

export default function ContentManagerPageRedirect() {
  redirect('/content-manager/dashboard');
}

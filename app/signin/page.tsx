import { SignInForm } from './signin-form';

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-zinc-50 px-4 py-12 font-sans dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Refolio
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in to your account
          </h1>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <SignInForm />
        </div>
      </div>
    </main>
  );
}

import SiteHeader from "@/components/layout/site-header"
import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center py-12">
        <LoginForm />
      </main>
    </>
  )
}

import SiteHeader from "@/components/layout/site-header"
import RegisterForm from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center py-12">
        <RegisterForm />
      </main>
    </>
  )
}

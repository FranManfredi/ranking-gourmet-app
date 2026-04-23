import { LoginForm } from "@/src/components/auth/login-form";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        <section className="max-w-xl space-y-5 text-zinc-900">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Better Auth + Ranking Gourmet
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
            Accedé al panel del proyecto con tu mail y contraseña.
          </h1>
          <p className="text-base text-zinc-600">
            El backend ya expone los endpoints de Better Auth en <code className="rounded-md bg-zinc-900/5 px-1.5 py-0.5 text-sm">/api/auth</code>.
            Desde acá manejamos un inicio de sesión clásico con email y password,
            persistiendo la sesión vía cookies HttpOnly como recomienda la librería.
          </p>
          <ul className="space-y-3 text-sm text-zinc-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
              Usa el cliente oficial de Better Auth para obtener y refrescar sesiones en el navegador.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
              Formulario simple validando email/contraseña y mostrando errores descriptivos.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
              Botón de cierre de sesión y vista de usuario activo si la cookie ya existe.
            </li>
          </ul>
        </section>

        <LoginForm />
      </div>
    </div>
  );
}

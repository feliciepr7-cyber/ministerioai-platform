import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Términos de Uso</CardTitle>
            <p className="text-center text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Aceptación de los Términos</h2>
              <p>Al acceder y utilizar nuestros servicios de Custom GPTs para ministerio, aceptas estar sujeto a estos Términos de Uso. Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestros servicios.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Descripción del Servicio</h2>
              <div className="space-y-3">
                <p>Ofrecemos acceso a tres Custom GPTs especializados para ministerios:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Generador de Sermones:</strong> Asistencia en la creación de sermones inspiradores</li>
                  <li><strong>Manual de Ceremonias del Ministro:</strong> Guía para ceremonias religiosas</li>
                  <li><strong>Mensajes Expositivos:</strong> Ayuda en el desarrollo de mensajes bíblicos</li>
                </ul>
                <p>Cada herramienta requiere un pago único de $20 USD para acceso permanente.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Registro y Cuenta de Usuario</h2>
              <div className="space-y-3">
                <p>Para usar nuestros servicios, debes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Crear una cuenta proporcionando información precisa y completa</li>
                  <li>Mantener la seguridad de tu contraseña</li>
                  <li>Notificarnos inmediatamente sobre cualquier uso no autorizado</li>
                  <li>Ser responsable de todas las actividades bajo tu cuenta</li>
                  <li>Tener al menos 18 años de edad</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Pagos y Facturación</h2>
              <div className="space-y-3">
                <p><strong>Estructura de precios:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cada Custom GPT cuesta $20 USD (pago único)</li>
                  <li>Los pagos se procesan de forma segura a través de Stripe</li>
                  <li>No hay tarifas recurrentes o suscripciones</li>
                  <li>El acceso es permanente una vez realizado el pago</li>
                </ul>
                <p><strong>Política de reembolsos:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Los reembolsos se evalúan caso por caso</li>
                  <li>Las solicitudes deben realizarse dentro de 7 días de la compra</li>
                  <li>No se otorgan reembolsos por uso indebido del servicio</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Uso Aceptable</h2>
              <div className="space-y-3">
                <p><strong>Está permitido:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Usar los GPTs para fines ministeriales legítimos</li>
                  <li>Generar contenido para sermones, ceremonias y mensajes</li>
                  <li>Compartir el contenido generado en tu ministerio</li>
                  <li>Usar el servicio para educación religiosa</li>
                </ul>
                <p><strong>Está prohibido:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Compartir credenciales de acceso con terceros</li>
                  <li>Usar el servicio para actividades ilegales</li>
                  <li>Generar contenido odioso, discriminatorio o dañino</li>
                  <li>Intentar hackear o comprometer el sistema</li>
                  <li>Revender o redistribuir el acceso a terceros</li>
                  <li>Usar bots o scripts automatizados</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Propiedad Intelectual</h2>
              <div className="space-y-3">
                <p><strong>Nuestros derechos:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Retenemos todos los derechos sobre la plataforma y tecnología</li>
                  <li>Los Custom GPTs son propiedad intelectual nuestra y de OpenAI</li>
                  <li>Las marcas comerciales y logos nos pertenecen</li>
                </ul>
                <p><strong>Tus derechos:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Posees el contenido que generes usando nuestras herramientas</li>
                  <li>Puedes usar el contenido generado libremente en tu ministerio</li>
                  <li>Mantienes los derechos de autor sobre tu contenido original</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Disponibilidad del Servicio</h2>
              <div className="space-y-3">
                <p>Nos esforzamos por mantener el servicio disponible, pero no garantizamos:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Disponibilidad 100% del tiempo</li>
                  <li>Que el servicio esté libre de errores</li>
                  <li>Que satisfaga todas tus necesidades específicas</li>
                  <li>Compatibilidad con todos los dispositivos o navegadores</li>
                </ul>
                <p>Podemos realizar mantenimiento programado con previo aviso cuando sea posible.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitación de Responsabilidad</h2>
              <div className="space-y-3">
                <p>En la máxima medida permitida por la ley:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>No seremos responsables por daños indirectos o consecuentes</li>
                  <li>Nuestra responsabilidad total no excederá el monto pagado por el servicio</li>
                  <li>No garantizamos la precisión teológica del contenido generado</li>
                  <li>El usuario es responsable de revisar todo el contenido antes de usarlo</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Terminación</h2>
              <div className="space-y-3">
                <p><strong>Puedes terminar tu cuenta:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>En cualquier momento contactándonos</li>
                  <li>Los pagos realizados no son reembolsables tras la terminación</li>
                </ul>
                <p><strong>Podemos terminar tu acceso si:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violas estos términos de uso</li>
                  <li>Usas el servicio de manera fraudulenta</li>
                  <li>Realizas actividades que dañen nuestro servicio</li>
                  <li>Incumples con las políticas de uso aceptable</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Modificaciones</h2>
              <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios significativos se comunicarán por correo electrónico o mediante aviso en el sitio web. El uso continuado después de los cambios constituye aceptación de los nuevos términos.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Ley Aplicable</h2>
              <p>Estos términos se rigen por las leyes de Puerto Rico. Cualquier disputa se resolverá en los tribunales competentes de Puerto Rico.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Separabilidad</h2>
              <p>Si alguna disposición de estos términos se considera inválida o inaplicable, las disposiciones restantes permanecerán en pleno vigor y efecto.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contacto</h2>
              <div className="bg-muted/30 border border-border rounded-lg p-4">
                <p>Para preguntas sobre estos términos de uso, contáctanos:</p>
                <ul className="mt-2 space-y-1">
                  <li><strong>Email:</strong> feliciepr7@gmail.com</li>
                  <li><strong>Sitio web:</strong> {window.location.origin}</li>
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">
                  Estamos disponibles para aclarar cualquier duda sobre nuestros términos de servicio.
                </p>
              </div>
            </section>

            <section className="border-t pt-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Reconocimiento</h3>
                <p className="text-sm">
                  Al usar nuestros servicios, reconoces que has leído, entendido y aceptado estos términos de uso en su totalidad.
                  Estos términos constituyen un acuerdo legal entre tú y nuestro servicio.
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
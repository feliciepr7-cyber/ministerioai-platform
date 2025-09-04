import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Política de Privacidad</CardTitle>
            <p className="text-center text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Información que Recopilamos</h2>
              <div className="space-y-3">
                <p>Recopilamos la siguiente información cuando utilizas nuestros servicios:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Información de cuenta:</strong> Nombre de usuario, dirección de correo electrónico y contraseña cifrada.</li>
                  <li><strong>Información de pago:</strong> Datos de transacciones procesados de forma segura a través de Stripe. No almacenamos información de tarjetas de crédito.</li>
                  <li><strong>Información de uso:</strong> Registros de acceso a los GPTs, frecuencia de uso y métricas de rendimiento.</li>
                  <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, sistema operativo y datos de sesión.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Cómo Utilizamos Tu Información</h2>
              <div className="space-y-3">
                <p>Utilizamos tu información para:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Proporcionar acceso a nuestros Custom GPTs de ministerio</li>
                  <li>Procesar pagos y gestionar suscripciones</li>
                  <li>Mejorar nuestros servicios y experiencia del usuario</li>
                  <li>Enviar notificaciones importantes sobre tu cuenta</li>
                  <li>Cumplir con obligaciones legales y regulatorias</li>
                  <li>Prevenir fraudes y garantizar la seguridad del servicio</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Compartir Información</h2>
              <div className="space-y-3">
                <p>No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto en los siguientes casos:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Proveedores de servicios:</strong> Stripe para procesamiento de pagos, OpenAI para servicios de GPT</li>
                  <li><strong>Cumplimiento legal:</strong> Cuando sea requerido por ley o para proteger nuestros derechos</li>
                  <li><strong>Transferencias comerciales:</strong> En caso de fusión, adquisición o venta de activos</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Seguridad de Datos</h2>
              <div className="space-y-3">
                <p>Implementamos medidas de seguridad robustas para proteger tu información:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cifrado de contraseñas utilizando algoritmos seguros</li>
                  <li>Conexiones HTTPS para todas las comunicaciones</li>
                  <li>Acceso restringido a datos personales</li>
                  <li>Monitoreo regular de seguridad</li>
                  <li>Cumplimiento de estándares de seguridad de la industria</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Tus Derechos</h2>
              <div className="space-y-3">
                <p>Tienes derecho a:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Acceder a tu información personal</li>
                  <li>Corregir datos inexactos</li>
                  <li>Solicitar la eliminación de tu cuenta</li>
                  <li>Portabilidad de datos</li>
                  <li>Retirar el consentimiento en cualquier momento</li>
                  <li>Presentar quejas ante autoridades de protección de datos</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Cookies y Tecnologías Similares</h2>
              <div className="space-y-3">
                <p>Utilizamos cookies esenciales para:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Mantener tu sesión de usuario</li>
                  <li>Recordar tus preferencias</li>
                  <li>Mejorar la funcionalidad del sitio</li>
                  <li>Analizar el uso del servicio</li>
                </ul>
                <p>Puedes controlar las cookies a través de la configuración de tu navegador.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Retención de Datos</h2>
              <p>Conservamos tu información personal mientras mantengas una cuenta activa o según sea necesario para proporcionar servicios. Los datos se eliminan de forma segura después del cierre de la cuenta, excepto cuando la retención sea requerida por ley.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Menores de Edad</h2>
              <p>Nuestros servicios están dirigidos a adultos y no recopilamos intencionalmente información de menores de 18 años. Si descubrimos que hemos recopilado información de un menor, la eliminaremos inmediatamente.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Cambios a Esta Política</h2>
              <p>Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos por correo electrónico o mediante un aviso prominente en nuestro sitio web. El uso continuado del servicio después de los cambios constituye tu aceptación de la nueva política.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contacto</h2>
              <div className="bg-muted/30 border border-border rounded-lg p-4">
                <p>Si tienes preguntas sobre esta política de privacidad o el manejo de tus datos, contáctanos:</p>
                <ul className="mt-2 space-y-1">
                  <li><strong>Email:</strong> feliciepr7@gmail.com</li>
                  <li><strong>Sitio web:</strong> https://authflow.frankiefelicie.net/</li>
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">
                  Nos comprometemos a responder a tus consultas de privacidad dentro de 30 días.
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
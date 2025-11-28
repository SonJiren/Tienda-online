# Instrucciones para Configurar el Envío de Emails

El formulario de contacto está configurado para enviar mensajes a: **espartano.gamer04@gmail.com**

## Opción 1: EmailJS (Recomendado - Envío automático)

EmailJS es un servicio gratuito que permite enviar emails desde el frontend sin necesidad de backend.

### Pasos para configurar:

1. **Crear cuenta en EmailJS:**
   - Ve a https://www.emailjs.com/
   - Regístrate (es gratis hasta 200 emails/mes)

2. **Configurar un servicio de email:**
   - En el dashboard, ve a "Email Services"
   - Conecta tu cuenta de Gmail (espartano.gamer04@gmail.com)
   - Copia el **Service ID**

3. **Crear un template:**
   - Ve a "Email Templates"
   - Crea un nuevo template con estos campos:
     ```
     Subject: Nuevo mensaje de contacto de {{from_name}}
     
     Contenido:
     Nombre: {{from_name}}
     Email: {{from_email}}
     Teléfono: {{phone}}
     
     Mensaje:
     {{message}}
     ```
   - En "To Email" pon: espartano.gamer04@gmail.com
   - Copia el **Template ID**

4. **Obtener Public Key:**
   - Ve a "Account" > "General"
   - Copia tu **Public Key**

5. **Actualizar el código:**
   - Abre `script.js`
   - Busca estas líneas y reemplaza con tus valores:
     ```javascript
     emailjs.init("YOUR_PUBLIC_KEY"); // Reemplaza con tu Public Key
     const serviceID = 'YOUR_SERVICE_ID'; // Reemplaza con tu Service ID
     const templateID = 'YOUR_TEMPLATE_ID'; // Reemplaza con tu Template ID
     ```

## Opción 2: Método Alternativo (Sin configuración)

Si no quieres configurar EmailJS, el formulario usará automáticamente el método `mailto:` que abrirá tu cliente de correo predeterminado con el mensaje prellenado.

**Nota:** Este método requiere que el usuario tenga configurado un cliente de correo en su computadora.

## Prueba el formulario

Una vez configurado, cuando alguien envíe un mensaje desde el formulario, recibirás un email en **espartano.gamer04@gmail.com** con toda la información del contacto.


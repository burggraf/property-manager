interface EmailTemplate {
    subject: string;
    html: string;
  }

export const emailTemplates: Record<string, Record<string, EmailTemplate>> = {
    signup: {
      en: {
        subject: "Confirm your signup",
        html: `
          <h2>Confirm your signup</h2>
          <p>Follow this link to confirm your user:</p>
          <p><a href="{{.ConfirmationURL}}">Confirm your mail</a></p>
        `,
      },
      es: {
        subject: "Confirma tu registro",
        html: `
          <h2>Confirma tu registro</h2>
          <p>Sigue este enlace para confirmar tu usuario:</p>
          <p><a href="{{.ConfirmationURL}}">Confirmar tu correo</a></p>
        `,
      },
    },
    invite: {
      en: {
        subject: "You have been invited",
        html: `
          <h2>You have been invited</h2>
          <p>You have been invited to create a user on {{.SiteURL}}. Follow this link to accept the invite:</p>
          <p><a href="{{.ConfirmationURL}}">Accept the invite</a></p>
        `,
      },
      es: {
        subject: "Has sido invitado",
        html: `
          <h2>Has sido invitado</h2>
          <p>Has sido invitado a crear un usuario en {{.SiteURL}}. Sigue este enlace para aceptar la invitación:</p>
          <p><a href="{{.ConfirmationURL}}">Aceptar la invitación</a></p>
        `,
      },
    },
    magiclink: {
      en: {
        subject: "Your Magic Link",
        html: `
          <h2>Magic Link</h2>
          <p>Follow this link to login:</p>
          <p><a href="{{.ConfirmationURL}}">Log In</a></p>
        `,
      },
      es: {
        subject: "Tu Enlace Mágico",
        html: `
          <h2>Enlace Mágico</h2>
          <p>Sigue este enlace para iniciar sesión:</p>
          <p><a href="{{.ConfirmationURL}}">Iniciar Sesión</a></p>
        `,
      },
    },
    recovery: {
      en: {
        subject: "Reset Your Password",
        html: `
          <h2>Reset Password</h2>
          <p>Follow this link to reset the password for your user:</p>
          <p><a href="{{.ConfirmationURL}}">Reset Password</a></p>
        `,
      },
      es: {
        subject: "Restablece tu Contraseña",
        html: `
          <h2>Restablecer Contraseña</h2>
          <p>Sigue este enlace para restablecer la contraseña de tu usuario:</p>
          <p><a href="{{.ConfirmationURL}}">Restablecer Contraseña</a></p>
        `,
      },
    },
    email_change: {
      en: {
        subject: "Confirm Change of Email",
        html: `
          <h2>Confirm Change of Email</h2>
          <p>Follow this link to confirm the update of your email from {{.Email}} to {{.NewEmail}}:</p>
          <p><a href="{{.ConfirmationURL}}">Change Email</a></p>
        `,
      },
      es: {
        subject: "Confirma el Cambio de Correo Electrónico",
        html: `
          <h2>Confirma el Cambio de Correo Electrónico</h2>
          <p>Sigue este enlace para confirmar la actualización de tu correo electrónico de {{.Email}} a {{.NewEmail}}:</p>
          <p><a href="{{.ConfirmationURL}}">Cambiar Correo Electrónico</a></p>
        `,
      },
    },
    reauthentication: {
      en: {
        subject: "Confirm reauthentication",
        html: `
          <h2>Confirm reauthentication</h2>
          <p>Enter the code: {{.Token}}</p>
        `,
      },
      es: {
        subject: "Confirma la reautenticación",
        html: `
          <h2>Confirma la reautenticación</h2>
          <p>Ingresa el código: {{.Token}}</p>
        `,
      },
    },
  };

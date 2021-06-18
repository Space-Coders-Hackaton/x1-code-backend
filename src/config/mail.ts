interface IMailConfig {
  driver: 'sendgrid';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER,

  defaults: {
    from: {
      email: 'spacecoders.team@gmail.com',
      name: 'X1 Code - Space Coders',
    },
  },
} as IMailConfig;

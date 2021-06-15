import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserProps {
  @IsEmail(
    { allow_ip_domain: false },
    {
      message: 'Informe um email valido.',
    },
  )
  email: string;

  @IsNotEmpty({ message: 'Informe uma senha.' })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, {
    message:
      'No mínimo 8 caracteres, com no mínimo um número, um caractere especial, uma letra maiúscula e uma letra minúscula.',
  })
  password: string;
}

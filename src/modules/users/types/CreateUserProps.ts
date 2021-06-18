import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserProps {
  @IsNotEmpty({ message: 'Informe seu nome.' })
  @IsString({ message: 'Informe um nome válido.' })
  name: string;

  @IsEmail(
    { allow_ip_domain: false },
    {
      message: 'Informe um email válido.',
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

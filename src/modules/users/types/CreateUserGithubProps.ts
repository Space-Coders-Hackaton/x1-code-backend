import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserGithubProps {
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
}

import { Usuario } from "./Usuario";

// Define essa tipagem como uma extensão de Usuario que recebe email
export interface UsuarioLogin extends Pick<Usuario, 'email'> {
  senha: string;
}

import { LoginInputDTO, SignupInputDTO, TokenDTO } from '../dto';

export interface AuthService {
  signup(data: SignupInputDTO): Promise<any>;
  login(data: LoginInputDTO): Promise<TokenDTO>;
}

import 'jasmine'
import { Deliverer, Address } from '../src/deliverer'
import { DeliverersService } from '../src/deliverers-service'
import { RegisterResponse } from '../src/deliverer-register-response'

describe('O servico de entregadores', () => {
  let deliverersService: DeliverersService;

  const deliverer1 = new Deliverer ('João da Silva', 
  'js@email.com', 
  '1234', 
  '(85)8682-7970', 
  '25769318041', 
  new Date(4, 12, 1995), 
  new Address('69059-422', 
    'Rua Tanna Holanda', 
    92,
    'Jardim Arapongas', 
    'Manaus', 
    'AM')
  );

  const deliverer2 = new Deliverer ('Ágatha Santos Barbosa', 
  'AgathaSantosBarbosa@rhyta.com', 
  '4539', 
  '(11)9233-3706', 
  '59603923567',
  new Date(10, 26, 1988), 
  new Address('45810-000', 'Ladeira do Aeroporto', 317, 'Aeroporto', 'Porto Seguro', 'BA')
  );

  beforeEach(() => deliverersService = new DeliverersService());

  it('Inicializa vazio', () => {
    expect(deliverersService.Deliverers.length).toBe(0);
  })

  it('Cadastro De Usuario Realizado', () => {
    let addOne = deliverersService.addDeliverer(deliverer1);
    let addTwo = deliverersService.addDeliverer(deliverer2);

    expect(addOne).toBe(RegisterResponse.REGISTERED);
    expect(addTwo).toBe(RegisterResponse.REGISTERED);
    expect(deliverersService.Deliverers.length).toBe(2);
  })

  it('Cadastro De Usuario Nao Realizado CNH ja cadastrada', () => {
    let addOne = deliverersService.addDeliverer(deliverer1);
    let addTwo = deliverersService.addDeliverer(deliverer1);                                   
    
    expect(addOne).toBe(RegisterResponse.REGISTERED);
    expect(addTwo).toBe(RegisterResponse.EXISTS);
    expect(deliverersService.Deliverers.length).toBe(1);
  })

  it('Cadastro De Usuario Nao Realizado Email ja Cadastrado', () => {
    let addOne = deliverersService.addDeliverer(deliverer1);
    let addTwo = deliverersService.addDeliverer(deliverer1);                                   
    
    expect(addOne).toBe(RegisterResponse.REGISTERED);
    expect(addTwo).toBe(RegisterResponse.EXISTS);
    expect(deliverersService.Deliverers.length).toBe(1);
  })

  it('Cadastro De Usuario Nao Realizado Dado Ausente no Cadastro)', () => {
    let deliverer = new Deliverer ('João da Silva', 
    'js@email.com', 
    '1234', 
    '', 
    '25769318041', 
    new Date(4, 12, 1995), 
    new Address('69059-422', 
      '', 
      92,
      'Jardim Arapongas', 
      'Manaus', 
      'AM')
    );
    
    let add = deliverersService.addDeliverer(deliverer);

    expect(add).toBe(RegisterResponse.MISSING_DATA);
    expect(deliverersService.Deliverers.length).toBe(0);
  })

  it('Valida Email e Senha do Usuario com Sucesso', () => {
    deliverersService.addDeliverer(deliverer1);
    let correctEmail = 'js@email.com'
    let correctPassword = '1234'
    let delivererLogged = deliverersService.validateCredentials(correctEmail, correctPassword);

    expect(delivererLogged).toBe(deliverersService.Deliverers[0]);
  })

  it('Nao Valida Email e Senha do Entregador Email Incorreto', () => {
    deliverersService.addDeliverer(deliverer1);
    let wrongEmail = 'wrongEmail@email.com'
    let delivererLogged = deliverersService.validateCredentials(wrongEmail, deliverer2.Password);

    expect(delivererLogged).toBe(null);
  })

  it('Nao Valida Email e Senha do Entregador Senha Incorreta', () => {
    deliverersService.addDeliverer(deliverer1);
    let wrongPassword = 'wrongPassword'
    let delivererLogged = deliverersService.validateCredentials(deliverer1.Email, wrongPassword);

    expect(delivererLogged).toBe(null);
  })

  it('Nao Valida Email e Senha do Entregador Dado Nao Preenchido', () => {
    deliverersService.addDeliverer(deliverer1);
    let delivererLogged = deliverersService.validateCredentials('', deliverer2.Password);

    expect(delivererLogged).toBe(null);
  })

  it('Encontra Entregador a Partir do ID com Sucesso', () => {
    deliverersService.addDeliverer(deliverer1);
    let correctID = deliverersService.Deliverers[0].ID;
    let deliverer = deliverersService.getById(correctID);

    expect(deliverer).toBe(deliverersService.Deliverers[0]);
  })

  it('Nao Encontra Entregador a Partir do ID ID Incorreta ou Ausente', () => {
    deliverersService.addDeliverer(deliverer1);
    deliverer2.ID = 2;

    let deliverer = deliverersService.getById(deliverer2.ID);

    expect(deliverer).toBe(null);    
  })

  it('Encontra Entregadores Disponiveis para Entrega com Sucesso', () => {
    deliverersService.addDeliverer(deliverer1);
    deliverersService.addDeliverer(deliverer2);

    let availables = deliverersService.getAvailables();

    expect(availables.length).toBe(deliverersService.Deliverers.length);
  })

  it('atualiza saldo da carteira corretamente', () => {
    deliverersService.addDeliverer(deliverer1)
    deliverersService.addDeliverer(deliverer2)

    deliverersService.getById(deliverer2.ID).addBalance(5.0)
    deliverersService.getById(deliverer2.ID).addBalance(7.0)
    expect(deliverersService.getById(deliverer2.ID).Wallet).toBe(12.0)
  })
})

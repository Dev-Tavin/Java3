# MecaGestão

Sistema web para gestão de uma oficina mecânica. Ele centraliza o cadastro de clientes, veículos, mecânicos e serviços, e controla as ordens de serviço, do recebimento do veículo até a conclusão do trabalho.

Projeto da disciplina, desenvolvido com Spring Framework. Este documento corresponde à **1ª etapa**: tema, protótipos de tela, diagrama de classes e MER.

## Funcionalidades

| Módulo | Operações | Descrição |
| --- | --- | --- |
| Clientes | Cadastro, edição, exclusão e listagem | Donos dos veículos atendidos |
| Veículos | Cadastro, edição, exclusão e listagem | Cada veículo pertence a um cliente |
| Mecânicos | Cadastro, edição, exclusão e listagem | Profissionais responsáveis pelas ordens |
| Serviços | Cadastro, edição, exclusão e listagem | Catálogo de serviços com preço base |
| Ordens de serviço | Cadastro, edição, exclusão, listagem e detalhe | Atendimento de um veículo, com um ou mais serviços |

## Arquitetura e tecnologias

O sistema usa a arquitetura MVC, com Spring MVC, Thymeleaf, Spring Data JPA e banco de dados relacional MySQL.

| Camada | Componentes |
| --- | --- |
| Model | Entity, Repository e Service |
| Control | Controllers |
| View | Telas HTML/CSS/JS com Thymeleaf |

Os Controllers acessam apenas os Services. Somente os Services acessam os Repositories.

## Diagrama de classes

```mermaid
classDiagram
    direction LR

    class Cliente {
        -Long id
        -String nome
        -String cpf
        -String telefone
        -String email
    }

    class Veiculo {
        -Long id
        -String placa
        -String marca
        -String modelo
        -Integer ano
        -String cor
    }

    class Mecanico {
        -Long id
        -String nome
        -String especialidade
        -String telefone
        -Boolean ativo
    }

    class Servico {
        -Long id
        -String nome
        -String descricao
        -BigDecimal precoBase
    }

    class OrdemServico {
        -Long id
        -LocalDate dataAbertura
        -LocalDate dataConclusao
        -StatusOrdemServico status
        -String problemaRelatado
        -String observacoes
        +getValorTotal() BigDecimal
    }

    class ItemOrdemServico {
        -Long id
        -Integer quantidade
        -BigDecimal precoUnitario
        +getSubtotal() BigDecimal
    }

    class StatusOrdemServico {
        <<enumeration>>
        ABERTA
        EM_ANDAMENTO
        CONCLUIDA
        CANCELADA
    }

    Cliente "1" -- "0..*" Veiculo : possui
    Veiculo "1" -- "0..*" OrdemServico : recebe
    Mecanico "1" -- "0..*" OrdemServico : executa
    OrdemServico "1" *-- "1..*" ItemOrdemServico : contém
    Servico "1" -- "0..*" ItemOrdemServico : referenciado em
    OrdemServico --> "1" StatusOrdemServico : status
```

## MER

```mermaid
erDiagram
    CLIENTE ||--o{ VEICULO : possui
    VEICULO ||--o{ ORDEM_SERVICO : recebe
    MECANICO ||--o{ ORDEM_SERVICO : executa
    ORDEM_SERVICO ||--|{ ITEM_ORDEM_SERVICO : contem
    SERVICO ||--o{ ITEM_ORDEM_SERVICO : referenciado_em

    CLIENTE {
        bigint id PK
        varchar nome
        varchar cpf UK
        varchar telefone
        varchar email
    }

    VEICULO {
        bigint id PK
        varchar placa UK
        varchar marca
        varchar modelo
        int ano
        varchar cor
        bigint cliente_id FK
    }

    MECANICO {
        bigint id PK
        varchar nome
        varchar especialidade
        varchar telefone
        boolean ativo
    }

    SERVICO {
        bigint id PK
        varchar nome
        text descricao
        decimal preco_base
    }

    ORDEM_SERVICO {
        bigint id PK
        date data_abertura
        date data_conclusao
        varchar status
        text problema_relatado
        text observacoes
        bigint veiculo_id FK
        bigint mecanico_id FK
    }

    ITEM_ORDEM_SERVICO {
        bigint id PK
        int quantidade
        decimal preco_unitario
        bigint ordem_servico_id FK
        bigint servico_id FK
    }
```

O campo `preco_unitario` guarda o preço cobrado na ordem. Assim, alterar o preço base de um serviço não muda os valores de ordens já registradas.

O valor total da ordem não é armazenado. Ele é calculado pela soma de `quantidade × preco_unitario` dos itens.

## Protótipos de tela

**[Ver os protótipos de tela](prototipos/README.md)**

Há também uma versão navegável em HTML/CSS/JS. Para usá-la, baixe o repositório e abra o arquivo `prototipos/index.html` no navegador.

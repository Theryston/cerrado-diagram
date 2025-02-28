# Diagrama do Cerrado - Ferramenta de Investimentos

Esta aplicação implementa o método de investimento conhecido como "Diagrama do Cerrado". Este método consiste em atribuir notas a classes de ativos e aos próprios ativos, definindo uma alocação estratégica com base nessas notas.

## Funcionalidades

A aplicação possui os seguintes passos:

1. **Classes de Ativos**: Adicione classes de ativos (como Ações, FIIs, Renda Fixa, etc.) com sua nota (importância) e porcentagem alvo da carteira.
2. **Ativos**: Adicione ativos específicos (com ticker) para cada classe, informando a quantidade atual. O sistema busca o preço atual e determina a nota de cada ativo.
3. **Aporte**: Defina quanto deseja investir adicionalmente.
4. **Cálculo de Distribuição**: O sistema calcula inteligentemente como distribuir o novo aporte entre os ativos da carteira, considerando:
   - Notas das classes e dos ativos
   - Alocação atual vs. alocação alvo
   - Valores mínimos de investimento para cada ativo
5. **Implementação do Aporte**: Após fazer seus investimentos, registre os valores reais aportados para atualizar a carteira.

## Características

- Interface intuitiva com passos organizados em timeline
- Toda a informação fica salva no localStorage do navegador
- É possível voltar a qualquer etapa e editar informações a qualquer momento
- Os cálculos são ajustados automaticamente conforme você edita informações
- Compatível com diversos tipos de ativos (ações, FIIs, renda fixa, tesouro direto, etc.)

## Tecnologias

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn/UI

## Como usar

1. Clone o repositório
2. Instale as dependências com `pnpm install`
3. Configure sua API key (se necessário) no arquivo `.env.local`
4. Execute com `pnpm dev`
5. Acesse em `http://localhost:3000`

## Variáveis de Ambiente

- `NEXT_PUBLIC_BRAPI_API_KEY`: Chave de API para o serviço BRAPI (cotações de ativos)

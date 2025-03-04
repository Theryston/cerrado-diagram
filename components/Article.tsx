export function Article() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Diagrama do Cerrado: O Método Definitivo para Calcular Aportes em
        Investimentos
      </h2>

      <div className="prose prose-lg prose-indigo max-w-none">
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Sumário</h3>
          <ul className="space-y-1">
            <li>
              <a href="#o-que-e" className="text-gray-700 hover:text-gray-900">
                O que é o Diagrama do Cerrado?
              </a>
            </li>
            <li>
              <a
                href="#como-funciona"
                className="text-gray-700 hover:text-gray-900"
              >
                Como funciona o cálculo de aportes
              </a>
            </li>
            <li>
              <a
                href="#vantagens"
                className="text-gray-700 hover:text-gray-900"
              >
                Vantagens de usar o Diagrama do Cerrado
              </a>
            </li>
            <li>
              <a
                href="#passo-a-passo"
                className="text-gray-700 hover:text-gray-900"
              >
                Passo a passo para utilização
              </a>
            </li>
            <li>
              <a
                href="#estudo-caso"
                className="text-gray-700 hover:text-gray-900"
              >
                Estudo de caso: Otimizando uma carteira
              </a>
            </li>
            <li>
              <a
                href="#comparacao"
                className="text-gray-700 hover:text-gray-900"
              >
                Comparação com outros métodos
              </a>
            </li>
            <li>
              <a
                href="#ferramentas"
                className="text-gray-700 hover:text-gray-900"
              >
                Ferramentas complementares
              </a>
            </li>
            <li>
              <a href="#faq" className="text-gray-700 hover:text-gray-900">
                Perguntas frequentes
              </a>
            </li>
            <li>
              <a
                href="#conclusao"
                className="text-gray-700 hover:text-gray-900"
              >
                Conclusão e próximos passos
              </a>
            </li>
          </ul>
        </div>

        <p className="text-gray-700 mb-6">
          No universo dos investimentos, encontrar o equilíbrio perfeito para
          seus aportes mensais pode ser um desafio considerável. Com tantas
          opções disponíveis no mercado financeiro brasileiro - ações, FIIs,
          tesouro direto, fundos de investimento, renda fixa - como decidir
          exatamente quanto alocar em cada ativo para manter sua carteira
          equilibrada? É nesse cenário que o{" "}
          <strong>Diagrama do Cerrado</strong> surge como uma ferramenta
          revolucionária para investidores de todos os níveis.
        </p>

        <section id="o-que-e" className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            O que é o Diagrama do Cerrado?
          </h3>
          <p className="mb-4">
            O <strong>Diagrama do Cerrado</strong> é uma metodologia inovadora
            de cálculo de aportes em investimentos que foi desenvolvida para
            atender às necessidades específicas do investidor brasileiro. Seu
            nome faz referência ao bioma do Cerrado - diverso, resiliente e
            adaptável - características que também definem uma boa estratégia de
            investimentos.
          </p>
          <p className="mb-4">
            Esta ferramenta de cálculo de investimentos permite que você
            determine com precisão matemática quanto deve aportar em cada ativo
            da sua carteira, considerando:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>
              A alocação ideal por classe de ativos (ações, FIIs, renda fixa,
              etc.)
            </li>
            <li>
              A qualidade individual de cada ativo através de um sistema de
              notas
            </li>
            <li>A situação atual da sua carteira</li>
            <li>O valor disponível para aporte</li>
            <li>As limitações de compra de cada tipo de ativo</li>
          </ul>
          <p>
            Diferentemente de outras calculadoras de investimento que apenas
            sugerem percentuais genéricos por classe de ativos, o Diagrama do
            Cerrado vai além ao considerar a qualidade individual de cada
            investimento. Isso significa que, dentro de uma mesma classe (como
            ações, por exemplo), ativos com notas maiores receberão
            proporcionalmente mais recursos nos aportes mensais.
          </p>
        </section>

        <section id="como-funciona" className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Como funciona o cálculo de aportes no Diagrama do Cerrado
          </h3>

          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-700 mb-3">
              1. Definição dos percentuais ideais por classe de ativos
            </h4>
            <p>
              O primeiro passo é estabelecer qual a distribuição percentual
              ideal entre as diferentes classes de ativos na sua carteira. Por
              exemplo:
            </p>
            <ul className="list-disc pl-6 mb-2 mt-2 space-y-1">
              <li>Ações: 20%</li>
              <li>Fundos Imobiliários (FIIs): 30%</li>
              <li>Tesouro Direto: 50%</li>
            </ul>
            <p className="mt-2">
              Esta definição depende do seu perfil de investidor, objetivos
              financeiros e horizonte de tempo, e serve como base para todos os
              cálculos subsequentes.
            </p>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-700 mb-3">
              2. Atribuição de notas para cada ativo
            </h4>
            <p>
              No Diagrama do Cerrado, cada ativo individual recebe uma nota (de
              0 a 10) que reflete sua qualidade. Esta nota pode ser baseada em
              diversos critérios como:
            </p>
            <ul className="list-disc pl-6 mb-2 mt-2 space-y-1">
              <li>
                Para ações: dividendos, crescimento, gestão, solidez financeira
              </li>
              <li>Para FIIs: yield, qualidade dos imóveis, gestão, vacância</li>
              <li>Para Tesouro Direto: prazo, liquidez, taxa de retorno</li>
            </ul>
            <p className="mt-2">
              A nota de cada ativo influencia diretamente quanto do percentual
              da classe será destinado a ele.
            </p>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-700 mb-3">
              3. Cálculo do percentual ideal por ativo
            </h4>
            <p>
              O percentual ideal de cada ativo na carteira total é calculado
              usando a seguinte fórmula:
            </p>
            <div className="bg-gray-100 p-3 rounded my-3 font-mono text-sm">
              % Ideal do Ativo = (Nota do Ativo / Soma das Notas da Classe) × %
              Ideal da Classe
            </div>
            <p>
              Por exemplo, se você tem 5 ações com notas 10, 9, 8, 7 e 6 (soma =
              40), e o percentual ideal para ações é 20%, então:
            </p>
            <ul className="list-disc pl-6 my-2 space-y-1">
              <li>Ação com nota 10: (10/40) × 20% = 5% da carteira total</li>
              <li>Ação com nota 9: (9/40) × 20% = 4,5% da carteira total</li>
              <li>E assim por diante...</li>
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-700 mb-3">
              4. Análise da situação atual vs. situação ideal
            </h4>
            <p>
              O Diagrama do Cerrado compara o valor atual investido em cada
              ativo com o valor ideal segundo os percentuais calculados acima.
              Isso permite identificar quais ativos estão sub ou
              sobre-representados na carteira.
            </p>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-700 mb-3">
              5. Distribuição do valor disponível para aporte
            </h4>
            <p>
              Com base nas discrepâncias identificadas, o algoritmo distribui o
              valor disponível para aporte, priorizando:
            </p>
            <ol className="list-decimal pl-6 my-2 space-y-1">
              <li>
                Ativos mais distantes percentualmente do seu ideal (menor
                percentual atual em relação ao ideal)
              </li>
              <li>
                Ativos com notas mais altas dentro de suas respectivas classes
              </li>
              <li>
                Classes de ativos que estão abaixo do seu percentual ideal
              </li>
            </ol>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-700 mb-3">
              6. Ajuste para limitações de compra
            </h4>
            <p>
              O algoritmo faz ajustes finais considerando as limitações de
              compra de cada tipo de ativo:
            </p>
            <ul className="list-disc pl-6 my-2 space-y-1">
              <li>
                Ações e FIIs: ajusta para unidades inteiras (não é possível
                comprar 1,5 ações)
              </li>
              <li>Tesouro Direto: permite frações (como 0,01 títulos)</li>
              <li>Respeita o valor mínimo de investimento de cada ativo</li>
            </ul>
            <p className="mt-2">
              O resultado final é uma recomendação precisa de quanto investir em
              cada ativo, respeitando tanto sua estratégia de alocação quanto as
              limitações práticas do mercado.
            </p>
          </div>
        </section>

        <section id="vantagens" className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Vantagens de usar o Diagrama do Cerrado para seus investimentos
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Precisão matemática
              </h4>
              <p className="text-gray-600">
                Utiliza um algoritmo complexo que calcula com precisão
                matemática exatamente quanto você deve aportar em cada ativo,
                eliminando o &quot;achismo&quot; das decisões de investimento.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Consideração da qualidade dos ativos
              </h4>
              <p className="text-gray-600">
                Avalia a qualidade individual de cada investimento através do
                sistema de notas, direcionando recursos preferencialmente para
                os melhores ativos.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Adaptação ao mercado brasileiro
              </h4>
              <p className="text-gray-600">
                Compreende e se adapta às particularidades do mercado financeiro
                brasileiro, como a compra de ações e FIIs em unidades inteiras.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Otimização contínua da carteira
              </h4>
              <p className="text-gray-600">
                A cada novo aporte calculado, sua carteira se aproxima mais do
                equilíbrio ideal, trabalhando com uma visão de longo prazo.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Redução da influência emocional
              </h4>
              <p className="text-gray-600">
                Reduz significativamente a influência das emoções em suas
                decisões de investimento, evitando erros comuns como aportar em
                ativos &quot;da moda&quot;.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Economia de tempo
              </h4>
              <p className="text-gray-600">
                Automatiza cálculos complexos que levariam horas para serem
                feitos manualmente, fornecendo resultados em segundos.
              </p>
            </div>
          </div>
        </section>

        <section id="passo-a-passo" className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Passo a passo para utilizar o Diagrama do Cerrado
          </h3>

          <div className="space-y-6">
            <div className="border-l-4 pl-4">
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                1. Mapeamento da carteira atual
              </h4>
              <p className="text-gray-600">
                Faça um levantamento completo da sua carteira atual, listando
                todos os ativos com suas quantidades.
              </p>
            </div>

            <div className="border-l-4 pl-4">
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                2. Definição dos percentuais ideais por classe
              </h4>
              <p className="text-gray-600">
                Defina qual seria a distribuição ideal do seu patrimônio entre
                as diferentes classes de ativos, com base no seu perfil de
                investidor e objetivos financeiros.
              </p>
            </div>

            <div className="border-l-4 pl-4">
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                3. Atribuição de notas para cada ativo
              </h4>
              <p className="text-gray-600">
                Avalie cada um dos seus ativos e atribua uma nota de 0 a 10,
                considerando critérios relevantes para cada tipo de
                investimento, como dividendos, crescimento, gestão, etc.
              </p>
            </div>

            <div className="border-l-4 pl-4">
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                4. Inserção dos dados na ferramenta
              </h4>
              <p className="text-gray-600">
                Com todos os dados coletados, insira-os na ferramenta do
                Diagrama do Cerrado: classes, ativos, quantidades, notas e valor
                disponível para aporte.
              </p>
            </div>

            <div className="border-l-4 pl-4">
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                5. Análise das recomendações de aporte
              </h4>
              <p className="text-gray-600">
                A ferramenta fornecerá uma lista detalhada de recomendações,
                indicando quanto investir em cada ativo específico e a
                quantidade de unidades a comprar.
              </p>
            </div>

            <div className="border-l-4 pl-4">
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                6. Execução do plano de aportes
              </h4>
              <p className="text-gray-600">
                Acesse sua corretora de valores e realize as ordens de compra
                conforme recomendado, mantendo um registro das transações
                realizadas.
              </p>
            </div>

            <div className="border-l-4 pl-4">
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                7. Atualize os dados na ferramenta
              </h4>
              <p className="text-gray-600">
                Pegue os dados atualizados na sua corretora de valores (dados
                como: nova quantidade de ativos, valores, etc) e atualize na
                ferramenta.
              </p>
            </div>

            <div className="border-l-4 pl-4">
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                8. Monitoramento e ajustes periódicos
              </h4>
              <p className="text-gray-600">
                Recalcule suas recomendações de aporte mensalmente, reavalie as
                notas dos ativos trimestralmente e ajuste os percentuais ideais
                quando necessário.
              </p>
            </div>
          </div>
        </section>

        <section id="estudo-caso" className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Estudo de caso: Otimizando uma carteira com o Diagrama do Cerrado
          </h3>

          <div className="bg-gray-50 p-5 rounded-lg mb-6">
            <h4 className="text-xl font-semibold text-gray-700 mb-3">
              Situação inicial da carteira de João
            </h4>
            <p className="font-medium">Valor total da carteira: R$ 2.793,49</p>

            <div className="mt-3">
              <p className="font-medium">Distribuição por classes de ativos:</p>
              <ul className="list-disc pl-6 my-2 space-y-1">
                <li>Ações: 23,35% (meta: 20%)</li>
                <li>FIIs: 30,63% (meta: 30%)</li>
                <li>Tesouro Direto: 46,02% (meta: 50%)</li>
              </ul>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium mb-2">Ações:</p>
                <ul className="text-sm space-y-2">
                  <li>
                    SAPR4: 42 ações a R$ 5,38 (total R$ 225,96) - Nota 10 -
                    8,09% da carteira
                  </li>
                  <li>
                    ABEV3: 10 ações a R$ 12,15 (total R$ 121,50) - Nota 10 -
                    4,35% da carteira
                  </li>
                  <li>
                    TAEE4: 11 ações a R$ 10,94 (total R$ 120,34) - Nota 10 -
                    4,31% da carteira
                  </li>
                  <li>
                    BBAS3: 4 ações a R$ 27,23 (total R$ 108,92) - Nota 10 -
                    3,90% da carteira
                  </li>
                  <li>
                    BBSE3: 2 ações a R$ 37,80 (total R$ 75,60) - Nota 10 - 2,71%
                    da carteira
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-medium mb-2">FIIs:</p>
                <ul className="text-sm space-y-2">
                  <li>
                    GARE11: 24 cotas a R$ 7,99 (total R$ 191,76) - Nota 10 -
                    6,86% da carteira
                  </li>
                  <li>
                    MXRF11: 21 cotas a R$ 9,08 (total R$ 190,68) - Nota 8 -
                    6,83% da carteira
                  </li>
                  <li>
                    BTLG11: 2 cotas a R$ 94,50 (total R$ 189,00) - Nota 10 -
                    6,77% da carteira
                  </li>
                  <li>
                    HGLG11: 1 cota a R$ 151,06 (total R$ 151,06) - Nota 10 -
                    5,41% da carteira
                  </li>
                  <li>
                    KNRI11: 1 cota a R$ 133,12 (total R$ 133,12) - Nota 10 -
                    4,77% da carteira
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-medium mb-2">Tesouro Direto:</p>
              <ul className="text-sm">
                <li>
                  Tesouro Selic 2029: 0,07 título (total R$ 1.285,55) - Nota 10
                  - 46,02% da carteira
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-700 mb-3">
              Recomendação de aporte pelo Diagrama do Cerrado
            </h4>
            <p className="mb-3">
              Com base na análise, o Diagrama do Cerrado recomendou a seguinte
              distribuição para o aporte de R$ 600,00:
            </p>

            <div className="bg-white shadow-sm rounded-lg p-5 mb-3">
              <h5 className="text-lg font-medium text-gray-800 mb-2">
                Tesouro Direto (Prioridade):
              </h5>
              <p>
                Tesouro Selic 2029: <strong>R$ 300,00</strong>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Justificativa: Esta classe está abaixo do percentual ideal
                (46,02% vs. 50%) e este aporte ajudará a equilibrar a posição em
                renda fixa
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5 mb-3">
              <h5 className="text-lg font-medium text-gray-800 mb-2">FIIs:</h5>
              <p>
                HGLG11: <strong>R$ 150,00</strong> (1 cota)
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Justificativa: Está abaixo do percentual ideal (5,41% vs.
                6,25%), tem nota 10, e a compra de uma cota adicional aproximará
                do ideal
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h5 className="text-lg font-medium text-gray-800 mb-2">Ações:</h5>
              <p>
                BBSE3: <strong>R$ 150,00</strong> (aproximadamente 4 ações)
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Justificativa: Está significativamente abaixo do percentual
                ideal (2,71% vs. 4%), tem nota 10, e este valor permite a compra
                de 4 ações ao preço atual
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-gray-700 mb-3">
              Projeção após o aporte
            </h4>
            <p className="mb-2">
              Após executar este plano de aporte, a nova situação da carteira de
              João seria:
            </p>
            <p>
              <strong>Valor total da carteira:</strong> R$ 3.393,49 (R$ 2.793,49
              + R$ 600,00)
            </p>

            <div className="mt-3">
              <p className="font-medium">
                Nova distribuição por classes de ativos:
              </p>
              <ul className="list-disc pl-6 my-2 space-y-1">
                <li>
                  Ações: aproximadamente 23,6% (mais próximo do ideal de 20%)
                </li>
                <li>
                  FIIs: aproximadamente 29,6% (muito próximo do ideal de 30%)
                </li>
                <li>
                  Tesouro Direto: aproximadamente 46,8% (mais próximo do ideal
                  de 50%)
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="comparacao" className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Comparação com outros métodos de alocação de investimentos
          </h3>

          <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-6">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Método
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Características
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Vantagens do Diagrama do Cerrado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    Alocação por Objetivo
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    Divide investimentos por objetivos financeiros
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    Fornece recomendações específicas por ativo, não apenas por
                    categoria
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    DCA (Dollar-Cost Averaging)
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    Investir valores fixos em intervalos regulares
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    Distribui inteligentemente os recursos priorizando ativos
                    subrepresentados
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    Rebalanceamento Tradicional
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    Ajustar periodicamente vendendo e comprando
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    Não requer vendas de ativos, evitando custos de transação e
                    impostos
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    Value Averaging
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    Estabelece valor alvo e ajusta contribuições
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    Mais simples de implementar e funciona bem com aportes fixos
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    Planilhas Tradicionais
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    Acompanhamento manual via planilhas
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    Algoritmo sofisticado que considera múltiplas variáveis
                    simultaneamente
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="ferramentas" className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ferramentas complementares ao Diagrama do Cerrado
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white shadow rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Planilhas de acompanhamento
              </h4>
              <p className="text-gray-600 text-sm">
                Mantém registro detalhado de investimentos, desempenho e
                dividendos recebidos.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Ferramentas de análise fundamentalista
              </h4>
              <p className="text-gray-600 text-sm">
                Status Invest, Fundamentus e outras plataformas para embasar
                avaliação qualitativa.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Simuladores de carteira
              </h4>
              <p className="text-gray-600 text-sm">
                Permitem testar diferentes configurações antes de implementar
                mudanças.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Controle de orçamento pessoal
              </h4>
              <p className="text-gray-600 text-sm">
                Aplicativos para monitorar receitas e despesas e identificar
                oportunidades para aumentar aportes.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Plataformas educacionais
              </h4>
              <p className="text-gray-600 text-sm">
                Cursos e conteúdos sobre diferentes classes de ativos e
                estratégias de análise.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Ferramentas tributárias
              </h4>
              <p className="text-gray-600 text-sm">
                Softwares para cálculo de imposto de renda e otimização fiscal
                de operações.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Perguntas frequentes sobre o Diagrama do Cerrado
          </h3>

          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                O que diferencia o Diagrama do Cerrado de outras calculadoras?
              </h4>
              <p className="text-gray-600">
                O Diagrama do Cerrado considera não apenas a alocação por
                classes de ativos, mas também a qualidade individual de cada
                investimento através do sistema de notas. Além disso, foi
                desenvolvido especificamente para o contexto brasileiro.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Qual o investimento mínimo necessário?
              </h4>
              <p className="text-gray-600">
                Não existe um valor mínimo para utilizar o Diagrama do Cerrado.
                A ferramenta é adaptável a qualquer tamanho de carteira e valor
                de aporte, priorizando os investimentos mais importantes mesmo
                com aportes limitados.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Com que frequência devo recalcular meus aportes?
              </h4>
              <p className="text-gray-600">
                O ideal é recalcular seus aportes toda vez que tiver recursos
                disponíveis para investir. Além disso, é recomendável revisar as
                notas dos ativos trimestralmente e os percentuais ideais por
                classe anualmente.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Como atribuir notas objetivas aos meus ativos?
              </h4>
              <p className="text-gray-600">
                Para atribuir notas de forma mais objetiva, estabeleça critérios
                claros por tipo de ativo. Por exemplo, para ações, considere
                dividendos (0-2 pontos), crescimento (0-2 pontos), endividamento
                (0-2 pontos), etc., somando até 10 pontos.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                O Diagrama do Cerrado recomenda vender ativos?
              </h4>
              <p className="text-gray-600">
                Não, o Diagrama do Cerrado é focado na otimização através de
                novos aportes, não recomenda vendas. Isso evita custos de
                transação e impactos tributários desnecessários. Ativos com nota
                zero naturalmente deixarão de receber novos aportes.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                É possível usar para carteiras com muitos ativos?
              </h4>
              <p className="text-gray-600">
                Sim, o método é escalável e funciona bem tanto para carteiras
                com poucos ativos quanto para carteiras diversificadas com
                dezenas de investimentos. O algoritmo distribui eficientemente
                os recursos independentemente do número de ativos.
              </p>
            </div>
          </div>
        </section>

        <section id="conclusao" className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Conclusão e próximos passos
          </h3>

          <p className="mb-4">
            O <strong>Diagrama do Cerrado</strong> representa uma evolução
            significativa na forma como os investidores brasileiros podem
            planejar e executar suas estratégias de investimento. Ao combinar
            precisão matemática, consideração da qualidade individual dos ativos
            e adaptação às especificidades do mercado financeiro brasileiro,
            este método oferece uma solução completa para o desafio de decidir
            quanto aportar em cada investimento.
          </p>

          <div className="bg-gray-50 border-l-4 p-4 mb-6">
            <p className="font-medium text-black mb-2">
              As principais vantagens do Diagrama do Cerrado:
            </p>
            <ol className="list-decimal pl-5 text-black space-y-1">
              <li>
                <span className="text-gray-700">
                  Precisão e objetividade nas decisões de alocação
                </span>
              </li>
              <li>
                <span className="text-gray-700">
                  Valorização da qualidade dos ativos através do sistema de
                  notas
                </span>
              </li>
              <li>
                <span className="text-gray-700">
                  Otimização gradual da carteira sem necessidade de vendas
                </span>
              </li>
              <li>
                <span className="text-gray-700">
                  Adaptação às limitações práticas do mercado brasileiro
                </span>
              </li>
              <li>
                <span className="text-gray-700">
                  Redução da influência emocional nas decisões
                </span>
              </li>
              <li>
                <span className="text-gray-700">
                  Economia de tempo com cálculos automatizados
                </span>
              </li>
              <li>
                <span className="text-gray-700">
                  Flexibilidade para diferentes perfis de investidor
                </span>
              </li>
            </ol>
          </div>

          <p className="mb-4">
            Para começar a utilizar o Diagrama do Cerrado em sua estratégia de
            investimentos, siga estes próximos passos:
          </p>

          <ol className="list-decimal pl-5 mb-6 space-y-2">
            <li>Faça um inventário completo da sua carteira atual</li>
            <li>Defina os percentuais ideais para cada classe de ativos</li>
            <li>Atribua notas a cada um dos seus ativos</li>
            <li>
              Utilize a ferramenta do Diagrama do Cerrado para calcular suas
              recomendações
            </li>
            <li>Implemente as recomendações através da sua corretora</li>
            <li>Reavalie periodicamente as notas e percentuais</li>
          </ol>

          <p>
            Lembre-se de que o investimento bem-sucedido é uma maratona, não uma
            corrida de curta distância. O Diagrama do Cerrado é uma ferramenta
            para disciplinar e otimizar sua jornada de investimentos no longo
            prazo, ajudando-o a construir gradualmente uma carteira que reflita
            seus objetivos e preferências de risco.
          </p>
        </section>
      </div>
    </div>
  );
}

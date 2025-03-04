"use client";

import { AssetClassForm } from "@/components/AssetClassForm";
import { AssetForm } from "@/components/AssetForm";
import { ContributionForm } from "@/components/ContributionForm";
import { InvestmentResults } from "@/components/InvestmentResults";
import { Timeline, TimelineStep } from "@/components/Timeline";
import { Article } from "@/components/Article";
import { Header } from "@/components/Header";
import { STEPS } from "@/lib/constants";
import { useGlobal } from "./context";

export default function Home() {
  const { completedSteps, currentStep } = useGlobal();

  const timelineSteps: TimelineStep[] = [
    {
      id: STEPS.ASSET_CLASSES,
      title: "1. Classes de Ativos",
      description:
        "Defina as classes de ativos que deseja incluir no seu diagrama e o percentual para cada classe.",
      isComplete: completedSteps[STEPS.ASSET_CLASSES],
      content: <AssetClassForm />,
    },
    {
      id: STEPS.ASSETS,
      title: "2. Ativos",
      description:
        "Defina os ativos que você deseja incluir no seu diagrama e a quantidade que você tem de cada ativo. (OBS: Se você não tem um ativo, você pode inserir o valor 0)",
      isComplete: completedSteps[STEPS.ASSETS],
      content: <AssetForm />,
    },
    {
      id: STEPS.CONTRIBUTION,
      title: "3. Aporte",
      description:
        "Defina o valor que você deseja investir, e o diagrama calculará a quantidade de cada ativo para você.",
      isComplete: completedSteps[STEPS.CONTRIBUTION],
      content: <ContributionForm />,
    },
    {
      id: STEPS.RESULTS,
      title: "4. Resultado",
      isComplete: completedSteps[STEPS.RESULTS],
      content: <InvestmentResults />,
    },
  ];

  return (
    <>
      <Header />

      <main className="container mx-auto pb-8 px-4">
        <div className="text-sm flex flex-col gap-4 text-muted-foreground">
          <p>
            Essa ferramenta foi desenvolvida para ajudar você a calcular a
            distribuição de seus investimentos usando o método do Diagrama do
            Cerrado.
          </p>
          <p>Para usar essa ferramenta basta seguir 4 passos simples:</p>

          <ul className="space-y-2">
            <li>
              <strong>1. Classes de Ativos</strong> - Defina as classes de
              ativos que deseja incluir no seu diagrama e o percentual para cada
              classe.
            </li>
            <li>
              <strong>2. Ativos</strong> - Defina os ativos que você deseja
              incluir no seu diagrama, dê uma nota para esses ativos e informe a
              quantidade que você já tem de cada ativo. (OBS: Se você não tem um
              ativo, você pode inserir o valor 0)
            </li>
            <li>
              <strong>3. Aporte</strong> - Defina o valor que você deseja
              investir, e a ferramenta calculará a quantidade de cada ativo para
              você.
            </li>
            <li>
              <strong>4. Resultado</strong> - A ferramenta irá mostrar o
              resultado da distribuição de seus investimentos te informando
              quanto deve investir em cada ativo.
            </li>
          </ul>
        </div>

        <Timeline steps={timelineSteps} currentStep={currentStep} />

        <hr className="my-8" />

        <div className="mt-12">
          <Article />
        </div>
      </main>
    </>
  );
}

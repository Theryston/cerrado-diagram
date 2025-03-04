"use client";

import { Download } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import Link from "next/link";
import { DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { DialogContent } from "./ui/dialog";
import { Dialog } from "./ui/dialog";
import { DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useGlobal } from "@/app/context";

export function Header() {
  const { code, setCode } = useGlobal();
  const [codeValue, setCodeValue] = useState(code);
  const [isImporting, setIsImporting] = useState(false);
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCodeValue(code);
  }, [code]);

  const handleImport = useCallback(async () => {
    if (codeValue === "") {
      toast.error("O código da carteira é obrigatório");
      return;
    }

    if (codeValue !== code) {
      setCode(codeValue);
    }

    setIsImporting(true);

    try {
      localStorage.setItem("cerrado-diagram-code", codeValue);
      await queryClient.invalidateQueries({ queryKey: ["walletData"] });
      setIsOpen(false);
    } catch {
      toast.error("Erro ao importar dados");
    } finally {
      setIsImporting(false);
    }
  }, [codeValue, code, setCode, queryClient]);

  return (
    <header className="border-b border-gray-200 mb-4">
      <div className="flex items-center justify-between container mx-auto p-4">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Logo />
          <h1 className="text-lg font-bold">Diagrama do Cerrado</h1>
        </Link>

        <div className="flex items-center gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="cursor-pointer"
                title="Importar carteira"
              >
                <Download className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar dados</DialogTitle>
                <DialogDescription>
                  Caso você tenha uma carteira que usou para calcular o Diagrama
                  do Cerrado em outro dispositivo, você pode importar para aqui
                  usando o código da carteira.
                </DialogDescription>
                <Input
                  type="text"
                  placeholder="Código da carteira"
                  value={codeValue}
                  onChange={(e) => setCodeValue(e.target.value)}
                />

                <Button onClick={handleImport} disabled={isImporting}>
                  {isImporting ? "Importando..." : "Importar"}
                </Button>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}

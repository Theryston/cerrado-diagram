"use client";

import { Download, RefreshCcw } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import Link from "next/link";
import { DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { DialogContent } from "./ui/dialog";
import { Dialog } from "./ui/dialog";
import { DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getWalletData } from "@/lib/api";

type HeaderProps = {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
};

export function Header({ code, setCode }: HeaderProps) {
  const [codeValue, setCodeValue] = useState(code);
  const [isImporting, setIsImporting] = useState(false);

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
      const response = await getWalletData(codeValue);

      const responseStr = JSON.stringify(response);

      localStorage.setItem("cerrado-diagram-data", responseStr);
      localStorage.setItem("cerrado-diagram-code", codeValue);

      window.location.reload();
    } catch {
      toast.error("Erro ao importar dados");
    } finally {
      setIsImporting(false);
    }
  }, [codeValue, code, setCode]);

  return (
    <header className="flex items-center justify-between mb-4 border-b border-gray-200 p-4">
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <Logo />
        <h1 className="text-lg font-bold">Diagrama do Cerrado</h1>
      </Link>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          onClick={() => handleImport()}
          title="Sincronizar carteira"
        >
          <RefreshCcw className="w-4 h-4" />
        </Button>
        <Dialog>
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
    </header>
  );
}

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/app/providers/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Save, X, AlertTriangle } from "lucide-react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import api from "@/src/services/apiClient";

interface Team {
  id: number;
  nome: string;
  modalidadeId: number;
}

interface Modality {
  id: number;
  nome: string;
  genero: string;
}

interface GameFormData {
  time1Id: string;
  time2Id: string;
  modalidadeId: string;
  dataHora: string;
  local: string;
  descricao: string;
}

export default function CreateGame() {
  const { token } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<GameFormData>({
    time1Id: "",
    time2Id: "",
    modalidadeId: "",
    dataHora: "",
    local: "",
    descricao: "",
  });

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      const [teamsRes, modalitiesRes] = await Promise.all([
        api.get("/api/teams"),
        api.get("/api/modalities"),
      ]);

      const teamsData = teamsRes?.data ?? teamsRes ?? [];
      const modalitiesData = modalitiesRes?.data ?? modalitiesRes ?? [];

      setTeams(Array.isArray(teamsData) ? teamsData : []);
      setModalities(Array.isArray(modalitiesData) ? modalitiesData : []);
    } catch (err) {
      setError(
        "Erro geral ao carregar dados. Verifique a conexão ou tente novamente.",
      );
      console.error("Erro ao carregar dados:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived list of teams filtered by currently selected modality.
  const filteredTeamsByModalidade = useMemo(() => {
    if (!formData.modalidadeId) return teams;
    const mid = parseInt(formData.modalidadeId, 10);
    return teams.filter((t) => t.modalidadeId === mid);
  }, [teams, formData.modalidadeId]);

  const handleInputChange = (field: keyof GameFormData, value: string) => {
    // If admin changes modalidade, reset team selections to avoid mismatched modalidade
    if (field === "modalidadeId") {
      setFormData((prev) => ({
        ...prev,
        modalidadeId: value,
        time1Id: "",
        time2Id: "",
      }));
      return;
    }

    // If admin changes time1 and it becomes equal to time2, clear time2
    if (field === "time1Id") {
      setFormData((prev) => ({
        ...prev,
        time1Id: value,
        time2Id: prev.time2Id === value ? "" : prev.time2Id,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (
      !formData.time1Id ||
      !formData.time2Id ||
      !formData.modalidadeId ||
      !formData.dataHora ||
      !formData.local
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }
    if (formData.time1Id === formData.time2Id) {
      setError(
        "Os times não podem ser iguais. Por favor, selecione times diferentes.",
      );
      setIsSubmitting(false);
      return;
    }

    // Validate that both selected teams belong to the selected modalidade
    const mid = parseInt(formData.modalidadeId, 10);
    const team1 = teams.find((t) => t.id.toString() === formData.time1Id);
    const team2 = teams.find((t) => t.id.toString() === formData.time2Id);
    if (
      !team1 ||
      !team2 ||
      team1.modalidadeId !== mid ||
      team2.modalidadeId !== mid
    ) {
      setError("Os times selecionados devem pertencer à modalidade escolhida.");
      setIsSubmitting(false);
      return;
    }

    try {
      const gameData = {
        time1Id: parseInt(formData.time1Id, 10),
        time2Id: parseInt(formData.time2Id, 10),
        modalidadeId: parseInt(formData.modalidadeId, 10),
        dataHora: new Date(formData.dataHora).toISOString(),
        local: formData.local,
        descricao: formData.descricao,
      };

      await api.post("/api/games", gameData);

      setSuccess("Jogo criado com sucesso!");

      setFormData({
        time1Id: "",
        time2Id: "",
        modalidadeId: "",
        dataHora: "",
        local: "",
        descricao: "",
      });

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro desconhecido ao criar jogo",
      );
      console.error("Erro ao submeter jogo:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/dashboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <header className="bg-background-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-text-primary">
                    Criar Novo Jogo
                  </h1>
                  <p className="text-sm text-text-secondary">
                    Adicione um novo jogo ao campeonato
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Jogo</CardTitle>
              <CardDescription>
                Preencha os dados para criar um novo jogo
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Erro!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-primary-100 bg-primary-50">
                    <AlertDescription className="text-primary-800">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="modalidadeId">Modalidade</Label>
                  <Select
                    value={formData.modalidadeId}
                    onValueChange={(value) =>
                      handleInputChange("modalidadeId", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {modalities.map((modality) => (
                        <SelectItem
                          key={modality.id}
                          value={modality.id.toString()}
                        >
                          {modality.nome} - {modality.genero}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="time1Id">Time 1</Label>
                    <Select
                      value={formData.time1Id}
                      onValueChange={(value) =>
                        handleInputChange("time1Id", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o primeiro time" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTeamsByModalidade.length === 0 ? (
                          <SelectItem value="-1" disabled>
                            Nenhum time disponível para esta modalidade
                          </SelectItem>
                        ) : (
                          filteredTeamsByModalidade.map((team) => (
                            <SelectItem
                              key={team.id}
                              value={team.id.toString()}
                            >
                              {team.nome}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time2Id">Time 2</Label>
                    <Select
                      value={formData.time2Id}
                      onValueChange={(value) =>
                        handleInputChange("time2Id", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o segundo time" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTeamsByModalidade.filter(
                          (team) => team.id.toString() !== formData.time1Id,
                        ).length === 0 ? (
                          <SelectItem value="-1" disabled>
                            Nenhum outro time disponível para esta modalidade
                          </SelectItem>
                        ) : (
                          filteredTeamsByModalidade
                            .filter(
                              (team) => team.id.toString() !== formData.time1Id,
                            )
                            .map((team) => (
                              <SelectItem
                                key={team.id}
                                value={team.id.toString()}
                              >
                                {team.nome}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataHora">Data e Hora</Label>
                  <Input
                    id="dataHora"
                    type="datetime-local"
                    value={formData.dataHora}
                    onChange={(e) =>
                      handleInputChange("dataHora", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="local">Local</Label>
                  <Input
                    id="local"
                    value={formData.local}
                    onChange={(e) => handleInputChange("local", e.target.value)}
                    placeholder="Ex: Quadra Principal, Ginásio"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição (Opcional)</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) =>
                      handleInputChange("descricao", e.target.value)
                    }
                    placeholder="Ex: Semifinal, Final, Quartas de Final..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Criar Jogo
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

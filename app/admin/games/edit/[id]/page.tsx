"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/providers/AuthContext";
import { useRouter, useParams } from "next/navigation";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Save, X } from "lucide-react";
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

interface Game {
  id: number;
  time1Id: number;
  time2Id: number;
  modalidadeId: number;
  dataHora: string;
  local: string;
  descricao: string;
  status: string;
  placar: {
    time1: number;
    time2: number;
  };
}

interface GameFormData {
  time1Id: string;
  time2Id: string;
  modalidadeId: string;
  dataHora: string;
  local: string;
  descricao: string;
}

export default function EditGame() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const gameId = params?.id as string;

  const [teams, setTeams] = useState<Team[]>([]);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [game, setGame] = useState<Game | null>(null);
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

  // API base is now configured via NEXT_PUBLIC_API_BASE and the centralized api client.
  // The client (imported as `api`) will use the env var NEXT_PUBLIC_API_BASE or fall back
  // to the production URL. Do not hardcode service URLs here.

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Use centralized api client which returns parsed bodies.
      // We normalize possible shapes (either direct array/object or { data: ... }).
      const [teamsRes, modalitiesRes, gameRes] = await Promise.all([
        api.get("/api/teams"),
        api.get("/api/modalities"),
        api.get(`/api/games/${gameId}`),
      ]);

      const teamsData = teamsRes?.data ?? teamsRes ?? [];
      const modalitiesData = modalitiesRes?.data ?? modalitiesRes ?? [];
      const gameData = gameRes?.data ?? gameRes ?? null;

      setTeams(Array.isArray(teamsData) ? teamsData : []);
      setModalities(Array.isArray(modalitiesData) ? modalitiesData : []);

      if (gameData) {
        setGame(gameData);

        // Preencher formulário com dados do jogo (ajusta formato para input datetime-local)
        setFormData({
          time1Id: (gameData.time1Id ?? "").toString(),
          time2Id: (gameData.time2Id ?? "").toString(),
          modalidadeId: (gameData.modalidadeId ?? "").toString(),
          dataHora: gameData.dataHora
            ? isNaN(new Date(gameData.dataHora).valueOf())
              ? ""
              : new Date(gameData.dataHora).toISOString().slice(0, 16)
            : "",
          local: gameData.local || "",
          descricao: gameData.descricao || "",
        });
      } else {
        setError("Jogo não encontrado");
      }
    } catch (err) {
      setError("Erro ao carregar dados");
      console.error("Erro ao carregar dados:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token, gameId]);

  useEffect(() => {
    if (gameId) {
      loadData();
    }
  }, [gameId, loadData]);

  const handleInputChange = (field: keyof GameFormData, value: string) => {
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

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const gameData = {
        time1Id: parseInt(formData.time1Id),
        time2Id: parseInt(formData.time2Id),
        modalidadeId: parseInt(formData.modalidadeId),
        dataHora: formData.dataHora,
        local: formData.local,
        descricao: formData.descricao,
      };

      // Use centralized api client; it throws on non-2xx responses.
      await api.put(`/api/games/${gameId}`, gameData);

      setSuccess("Jogo atualizado com sucesso!");

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar jogo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/dashboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Jogo não encontrado
          </h2>
          <Button onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Editar Jogo
                  </h1>
                  <p className="text-sm text-gray-500">
                    Modifique as informações do jogo
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
                Edite os dados do jogo selecionado
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

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
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id.toString()}>
                            {team.nome}
                          </SelectItem>
                        ))}
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
                        {teams
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
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

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
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
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

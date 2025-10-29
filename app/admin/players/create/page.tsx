"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/providers/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ArrowLeft, User, Save, Users } from "lucide-react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import api from "@/src/services/apiClient";

interface Player {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  posicao?: string;
  numero?: number;
  timeId?: number;
}

interface Team {
  id: number;
  nome: string;
  modalidadeId: number;
  descricao?: string;
  cor?: string;
}

export default function CreatePlayerPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [turmas, setTurmas] = useState<any[]>([]);
  const [modalidades, setModalidades] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nome: "",
    genero: "masculino", // Valor padrão, deve ser um dos valores do enum no backend
    turmaId: "1", // Valor padrão
    edicaoId: "1", // Valor padrão
    modalidadesIds: [] as string[],
    numeroCamisa: "", // Adicionar numeroCamisa ao estado
    timeId: "", // Adicionar timeId ao estado
  });

  const API_BASE_URL = "/api/players";

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Carregar turmas, modalidades e times usando o cliente centralizado `api`
      // Garantir que o token atual seja usado pelo cliente
      api.setAuthToken(token ?? null);

      const [turmasRes, modalidadesRes, teamsRes] = await Promise.all([
        // Try multiple possible endpoints for turmas and gracefully fall back if none exist.
        // Each attempt returns a value shaped like the api client (preferably { data: [...] }).
        (async () => {
          try {
            return await api.get("/api/turmas");
          } catch (err1) {
            try {
              return await api.get("/api/classes");
            } catch (err2) {
              try {
                return await api.get("/api/turma");
              } catch (err3) {
                // final fallback: return an empty data shape so downstream code continues to work
                return { data: [] };
              }
            }
          }
        })(),
        api.get("/api/modalities"),
        api.get("/api/teams"),
      ]);

      // Normalizar respostas do cliente (ele retorna o corpo já parseado, possivelmente em .data)
      const turmasData = turmasRes?.data ?? turmasRes ?? [];
      setTurmas(Array.isArray(turmasData) ? turmasData : []);

      const modalidadesData = modalidadesRes?.data ?? modalidadesRes ?? [];
      setModalidades(Array.isArray(modalidadesData) ? modalidadesData : []);

      const teamsData = teamsRes?.data ?? teamsRes ?? [];
      // Alguns backends retornam { teams: [...] }
      setTeams(Array.isArray(teamsData) ? teamsData : teamsData.teams || []);
    } catch (err) {
      setError("Erro ao carregar dados");
      console.error("Erro ao carregar dados:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      if (checkbox.checked) {
        setFormData((prev) => ({
          ...prev,
          modalidadesIds: [...prev.modalidadesIds, value],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          modalidadesIds: prev.modalidadesIds.filter((id) => id !== value),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      setError("Nome do jogador é obrigatório");
      return;
    }

    if (formData.modalidadesIds.length === 0) {
      setError("Selecione ao menos uma modalidade");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const playerData = {
        nome: formData.nome.trim(),
        genero: formData.genero, // Adicionar gênero
        turmaId: parseInt(formData.turmaId), // Converter para número
        edicaoId: parseInt(formData.edicaoId), // Converter para número
        modalidades: formData.modalidadesIds.map(Number), // Converter IDs de modalidade para números e renomear para 'modalidades'
        numeroCamisa: formData.numeroCamisa
          ? parseInt(formData.numeroCamisa)
          : undefined, // Converter para número e tratar como opcional
        timeId: formData.timeId ? parseInt(formData.timeId) : undefined, // Adicionar timeId
      };

      try {
        // Usar cliente centralizado e garantir token
        api.setAuthToken(token ?? null);
        const result = await api.post(API_BASE_URL, playerData);

        setSuccess(
          result?.message ||
            result?.data?.message ||
            "Jogador cadastrado com sucesso!",
        );

        setFormData({
          nome: "",
          genero: "masculino", // Resetar para valor padrão
          turmaId: "1",
          edicaoId: "1",
          modalidadesIds: [],
          numeroCamisa: "", // Resetar numeroCamisa
          timeId: "", // Resetar timeId
        });

        // Redirecionar após 2 segundos
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 2000);
      } catch (err: any) {
        const msg =
          err && err.body && err.body.message
            ? err.body.message
            : err && err.message
              ? err.message
              : "Erro ao cadastrar jogador";
        setError(msg);
      }
    } catch (err) {
      setError("Erro ao cadastrar jogador");
      console.error("Erro ao cadastrar jogador:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Cadastrar Jogador
                </h1>
                <p className="text-gray-600">
                  Adicione um novo jogador ao sistema
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Jogador</CardTitle>
              <CardDescription>Preencha os dados do jogador</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: João Silva"
                    required
                  />
                </div>

                {/* Gênero */}
                <div className="space-y-2">
                  <Label htmlFor="genero">Gênero *</Label>
                  <select
                    id="genero"
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="misto">Misto</option>
                  </select>
                </div>

                {/* Número da Camisa (Opcional) */}
                <div className="space-y-2">
                  <Label htmlFor="numeroCamisa">Número da Camisa</Label>
                  <Input
                    id="numeroCamisa"
                    name="numeroCamisa"
                    type="number"
                    value={formData.numeroCamisa}
                    onChange={handleInputChange}
                    placeholder="Ex: 10"
                    min="1"
                    max="99"
                  />
                </div>

                {/* Modalidades */}
                <div className="space-y-2">
                  <Label>Modalidades *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {modalidades.map((modalidade) => (
                      <div
                        key={modalidade.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={`modalidade-${modalidade.id}`}
                          name="modalidadesIds"
                          value={modalidade.id}
                          checked={formData.modalidadesIds.includes(
                            modalidade.id,
                          )}
                          onChange={handleInputChange}
                          className="form-checkbox h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <Label htmlFor={`modalidade-${modalidade.id}`}>
                          {modalidade.nome}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seleção de Time */}
                <div className="space-y-2">
                  <Label htmlFor="timeId">Time (Opcional)</Label>
                  <select
                    id="timeId"
                    name="timeId"
                    value={formData.timeId}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Selecione um time (opcional)</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campos ocultos para valores obrigatórios */}
                <input type="hidden" name="turmaId" value={formData.turmaId} />
                <input
                  type="hidden"
                  name="edicaoId"
                  value={formData.edicaoId}
                />

                {/* Error/Success Messages */}
                {error && <Alert variant="destructive">{error}</Alert>}

                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    {success}
                  </Alert>
                )}

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      "Cadastrando..."
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Cadastrar Jogador
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/dashboard")}
                  >
                    Cancelar
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

import { useMemo } from "react";
import { usePolos } from "./usePolos";
import { useModalidades } from "./useModalidades";
import { useCursos } from "./useCursos";
import { poloTelefoneMap, nivelEnsinoCursoMap, globalPoloOptions } from "@/mock/formsData";

/**
 * Hook para buscar dados de Polos do banco com fallback para o mock
 */
export const usePolosData = () => {
  const { polos, isLoading } = usePolos();

  return useMemo(() => {
    // Se carregando ou banco vazio, usar dados do mock
    if (isLoading || polos.length === 0) {
      return {
        poloOptions: globalPoloOptions,
        poloTelefoneMap: poloTelefoneMap,
        isLoading,
        isUsingMock: true,
      };
    }

    // Usar dados do banco
    const dbPoloOptions = polos.map((p) => p.nome);
    const dbPoloTelefoneMap = Object.fromEntries(
      polos.map((p) => [p.nome, p.telefone || ""])
    );

    return {
      poloOptions: dbPoloOptions,
      poloTelefoneMap: dbPoloTelefoneMap,
      isLoading,
      isUsingMock: false,
    };
  }, [polos, isLoading]);
};

/**
 * Hook para buscar dados de Cursos e Modalidades do banco com fallback para o mock
 */
export const useCursosData = () => {
  const { cursos, isLoading: cursosLoading } = useCursos();
  const { modalidades, isLoading: modalidadesLoading } = useModalidades();

  const isLoading = cursosLoading || modalidadesLoading;

  return useMemo(() => {
    // Se carregando ou banco vazio, usar dados do mock
    if (isLoading || cursos.length === 0 || modalidades.length === 0) {
      return {
        nivelEnsinoCursoMap: nivelEnsinoCursoMap,
        modalidadeOptions: Object.keys(nivelEnsinoCursoMap),
        isLoading,
        isUsingMock: true,
      };
    }

    // Construir mapa modalidade -> cursos a partir do banco
    const dbNivelEnsinoCursoMap: Record<string, string[]> = {};

    modalidades.forEach((mod) => {
      dbNivelEnsinoCursoMap[mod.nome] = cursos
        .filter((c) => c.modalidades?.some((m) => m.id === mod.id))
        .map((c) => c.nome)
        .sort();
    });

    // Filtrar apenas modalidades que têm cursos vinculados
    const modalidadeOptions = modalidades
      .map((m) => m.nome)
      .filter((nome) => dbNivelEnsinoCursoMap[nome]?.length > 0);

    return {
      nivelEnsinoCursoMap: dbNivelEnsinoCursoMap,
      modalidadeOptions,
      isLoading,
      isUsingMock: false,
    };
  }, [cursos, modalidades, isLoading]);
};

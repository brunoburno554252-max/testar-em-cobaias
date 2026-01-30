import { poloTelefoneMap, nivelEnsinoCursoMap, globalPoloOptions } from "@/mock/formsData";

/**
 * Hook para buscar dados de Polos - USANDO MOCK DIRETAMENTE
 * TODO: Quando o banco estiver completo, voltar a usar usePolos()
 */
export const usePolosData = () => {
  return {
    poloOptions: globalPoloOptions,
    poloTelefoneMap: poloTelefoneMap,
    isLoading: false,
    isUsingMock: true,
  };
};

/**
 * Hook para buscar dados de Cursos e Modalidades - USANDO MOCK DIRETAMENTE
 * TODO: Quando o banco estiver completo, voltar a usar useCursos() e useModalidades()
 */
export const useCursosData = () => {
  return {
    nivelEnsinoCursoMap: nivelEnsinoCursoMap,
    modalidadeOptions: Object.keys(nivelEnsinoCursoMap),
    isLoading: false,
    isUsingMock: true,
  };
};

export type resultado = {
    linha: string;
    prefixo: string;
    horario: string;
}

export type viagem = {
    prefixo: number;
    horario: string;
}

//armazenar os resultados individuais de cada linha
export type linha = {
    linha: number;
    viagens: viagem[];
}

export type infoOS = {
    linha: number;
    frota: number;
    intervalo: number;
}

export type infoRelatorio = {
    agente: string;
    matricula: number;
    local: string;
    ponto?: number;
    sentido: string;
    clima: string;
    frotaOS?: number;
    IntervaloOS?: number;
}

export type fiscalizacao = {
    descricao: string;
    data: string;
    hora: string;
    resultados: resultado[];
    observacoes?: string;
}
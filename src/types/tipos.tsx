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
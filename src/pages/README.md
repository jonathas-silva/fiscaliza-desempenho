### PROJETO DE SISTEMA DE FISCALIZAÇÃO DE TRANSPORTE PÚBLICO

Este projeto é um sistema para auxílio na fiscalização de transporte público municipal. Tem como resultado final um relatório em PDF, com base nas informações passadas pelo usuário, com um comparativo entre a qualidade do transporte público real e esperada. Está em teste na cidade de Campinas-SP.
Escrito em *typescript* utilizando as tecnologias **React** e **Bootstrap**.
O sistema é baseado somente em front-end, onde as informações trabalhadas pela aplicação (informações não sensíveis e de tamanho pequeno) são armazenadas temporariamente utilizando *LocalStorage*.
Por fim, foi feito uso da biblioteca [PdfMake](http://pdfmake.org/) para salvar os resultados da fiscalização em PDF.
# Vistoria de Roçada

App de campo para o diagnóstico da **roçada sistemática de áreas verdes**: cadastro de cada área, notas de 1 a 5 da vistoria, pontos fixos de evidência com foto e exportação no formato da planilha de diagnóstico que alimenta os planos de manutenção no SAP PM.

**Abrir no celular:** https://anderstuelp.github.io/vistoria-rocada/

No celular, use "Adicionar à tela inicial" para abrir como aplicativo. Depois do primeiro acesso, o app abre e funciona sem sinal.

## O que o app faz

| Aba | O que você registra |
| --- | --- |
| Cadastro | Local de instalação SAP, nome, setor, coordenada, m², geometria (poligonal ou linear), tipo de área, vegetação, terreno, método, interfaces críticas, periodicidade atual |
| Diagnóstico | Velocidade de crescimento, criticidade operacional, sensibilidade climática, condição atual e 9 subcritérios de risco, cada um de 1 a 5, com a régua de cada nível na tela |
| Histórico | Última roçada, roçadas em 12 meses, retrabalhos, reincidências, reclamações, não conformidades e dias até a área ficar Ruim |
| Evidências | Quantidade de pontos fixos calculada pelo tamanho e pela geometria da área; coordenada, direção, referência e foto de cada ponto, com carimbo de ID, ponto, data, hora e coordenada |

Enquanto você preenche, o app mostra uma **prévia da classe** (A a E) e dos ciclos de roçada (chuvoso / base / seco), com os mesmos pesos e regras da planilha. A classe oficial é a da planilha, depois da validação.

## Base carregada

O app já abre com as **186 áreas** da base Áreas de atendimento (`data/areas.json`):

| Local | Áreas | IDs |
| --- | --- | --- |
| Porto | 52 | PRT-001 a PRT-052 |
| Oficina | 85 | OFC-001 a OFC-085 |
| Pelotização | 31 | PEL-001 a PEL-031 |
| Perímetro (muro e cerca) | 18 trechos | PER-01 a PER-18 |

O tipo de área foi sugerido pelo nome e deve ser confirmado na vistoria. Nos trechos de muro e cerca, a área em m² é a extensão vezes uma faixa de 3 m (premissa a medir em campo).

## Onde ficam os dados

Aberto por este endereço, o app funciona em **modo local**: tudo o que você preenche (e as fotos) fica salvo **no próprio celular**, no navegador. Não há servidor nem banco compartilhado.

- Para juntar o trabalho da equipe, cada pessoa usa **Exportar planilha** (Excel com as abas BASE_AREAS, DIAGNOSTICO, HISTORICO, PONTOS_EVIDENCIA e PREVIA_CLASSE) e **Exportar fotos** (.zip com as fotos nomeadas no padrão `ID_Pnn_REF.jpg`).
- A aba LEIA_ME do Excel exportado explica quais colunas colar na planilha de diagnóstico, para não sobrescrever as fórmulas.
- Limpar os dados do navegador apaga o que não foi exportado. Exporte ao fim de cada dia de campo.

Dentro do Claude, o mesmo app usa um banco compartilhado, guarda as fotos na nuvem e sincroniza a equipe automaticamente.

## Estrutura do repositório

| Caminho | Conteúdo |
| --- | --- |
| `index.html` | O app inteiro (HTML, CSS e JavaScript em um arquivo) |
| `data/areas.json` | Base inicial das 186 áreas |
| `data/equipamentos.json` | Inventário de equipamentos (68 itens, com TAG e nº de série) |
| `planilha/Diagnostico_Rocada_Sistematica_SAP_PM.xlsx` | Planilha de diagnóstico, classificação, capacidade e estrutura dos planos SAP |
| `docs/Rocada_Sistematica_SAP_PM.docx` | Metodologia e projeto de implantação no SAP PM |
| `sw.js`, `manifest.webmanifest`, `icon-*.png` | Funcionamento sem sinal e instalação na tela inicial |

## Atualizar a base de áreas

Edite `data/areas.json` (um objeto por área, com o mesmo formato dos que já estão lá) e faça o commit. Na próxima vez que o celular abrir o app com sinal, ele carrega a base nova. O que já foi editado no aparelho continua valendo para aquela área.

## Bibliotecas

As bibliotecas de Excel ([SheetJS](https://sheetjs.com) 0.18.5) e de .zip ([JSZip](https://stuk.github.io/jszip/) 3.10.1) são carregadas do cdnjs só na primeira exportação e ficam guardadas para uso sem sinal.

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

Os dados ficam no **Supabase** e são compartilhados pela equipe.

- No primeiro acesso, o app pede o **código da equipe** e o **seu nome**. O código é passado pelo responsável e não fica neste repositório. O nome aparece como autor de cada alteração.
- Cada alteração é salva primeiro no celular e enviada assim que houver sinal. Sem sinal, o app continua funcionando e mostra quantas áreas estão "a enviar".
- As fotos vão para um armazenamento privado no Supabase. Só quem tem o código da equipe consegue vê-las.
- O app busca as alterações da equipe a cada minuto, ao voltar para a tela e ao tocar no indicador de envio no topo.
- Na primeira entrada com o banco vazio, o app carrega as 186 áreas de `data/areas.json`.
- **Exportar planilha** e **Exportar fotos** continuam disponíveis para consolidar na planilha de diagnóstico.

### Como o acesso é protegido

O repositório é público e a chave do Supabase no `index.html` é a chave publicável, feita para ficar no navegador. Ela sozinha não abre nada:

- As tabelas têm RLS ativo e nenhuma política, então não podem ser lidas nem gravadas diretamente.
- Toda leitura e gravação passa por funções do banco (`rocada_listar`, `rocada_salvar`, `rocada_excluir`…) que conferem o código da equipe. O banco guarda só o hash do código.
- As fotos ficam em um bucket privado e só saem por links temporários (1 hora), gerados pela função `rocada-fotos` depois de conferir o código.
- Toda gravação e exclusão fica registrada em `historico_alteracoes`, com autor e conteúdo.

### Trocar o código da equipe

No SQL Editor do Supabase:

```sql
select public.rocada_trocar_codigo('código-atual', 'código-novo');
```

Quem estiver com o código antigo volta para a tela de entrada na próxima sincronização. O que estiver salvo no celular e ainda não enviado não se perde: é enviado depois que a pessoa entra com o código novo.

### Projeto gratuito do Supabase

No plano gratuito, o projeto é pausado depois de 7 dias sem uso. Se o app mostrar "Conectando…" por muito tempo, abra o painel do Supabase e reative o projeto. Os dados não se perdem.

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

`data/areas.json` só é usado para carregar o banco quando ele está vazio. Depois disso, a base fica no Supabase: para incluir áreas novas, use **+ Nova área** ou **Importar cadastro** (Excel ou CSV) no próprio app.

## Bibliotecas

As bibliotecas de Excel ([SheetJS](https://sheetjs.com) 0.18.5) e de .zip ([JSZip](https://stuk.github.io/jszip/) 3.10.1) são carregadas do cdnjs só na primeira exportação e ficam guardadas para uso sem sinal.

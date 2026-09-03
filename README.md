# 🏢 Gestão de Alojamento — Rádio Patrulha (3º BPM)

Sistema web moderno e responsivo desenvolvido para o controle financeiro, gestão de mensalidades, fluxo de caixa e cadastro do efetivo do **Alojamento da Rádio Patrulha — 3º Batalhão de Polícia Militar**.

![Deploy no Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Google Sheets API](https://img.shields.io/badge/Backend-Google%20Sheets%20API-34A853?style=for-the-badge&logo=googlesheets&logoColor=white)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 📌 Funcionalidades Principais

* **💰 Controle de Mensalidades:**
  * Acompanhamento de pagamentos em tempo real (Pagos, Pendentes e Isentos).
  * Dashboard de adimplência com indicação percentual de quitação.
  * Lançamento rápido de pagamentos com anexação de comprovantes PIX.

* **📊 Fluxo de Caixa & Tesouraria:**
  * Gestão transparente de Entradas (mensalidades, doações) e Saídas (manutenção, materiais de limpeza, água mineral, alimentação).
  * Balanço financeiro automatizado em tempo real.
  * Emissão de balancetes e relatórios para prestação de contas.

* **👮 Cadastro do Efetivo (Efetivo RP):**
  * Gestão completa de policiais militares vinculados ao alojamento (Ativos / Inativos).
  * Registros por Posto/Graduação, Nome de Guerra, Matrícula e Contatos.

* **🔗 Integração Direta com Google Sheets:**
  * Sincronização em tempo real via **Google Apps Script Web App API**.
  * Todos os dados inseridos no sistema são armazenados com segurança na planilha oficial.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React, TypeScript, Tailwind CSS
- **Build Tool:** Vite / Bun
- **Backend / Database:** Google Sheets API + Google Apps Script (Web App)
- **Hospedagem & Deploy:** Netlify (Continuous Deployment via GitHub)
- **Prototipagem & IA:** Google AI Studio (Gemini)

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior) ou [Bun](https://bun.sh/)
- Gerenciador de pacotes (`npm`, `yarn` ou `bun`)

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/BrunoMateus8817/gestao-mensalidades-app.git](https://github.com/BrunoMateus8817/gestao-mensalidades-app.git)
   cd gestao-mensalidades-app

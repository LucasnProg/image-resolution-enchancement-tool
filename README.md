# Image Resolution Enhancement Tool 

Aplicação web full-stack para aumentar a resolução de imagens (Upscaling) utilizando Inteligência Artificial (**Real-ESRGAN**). O sistema melhora a qualidade de fotos de baixa resolução, aumentando seu tamanho em 4x com restauração de detalhes.

![Project Status](https://img.shields.io/badge/status-active-brightgreen)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)

## 📋 Funcionalidades

* **AI Upscaling:** Utiliza o modelo `RealESRGAN_x4plus` para aumentar a resolução em 400%.
* **Suporte a Formatos:** Aceita imagens PNG, JPEG, WEBP e BMP.
* **Interface Moderna:** Frontend responsivo e intuitivo construído com **React** e **TailwindCSS**.
* **Processamento Assíncrono:** Backend de alta performance com **FastAPI**.
* **Dockerizado:** Ambiente completo (Frontend + Backend + Proxy) configurado com Docker Compose.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
* **React (Vite):** Biblioteca para construção de interfaces.
* **TypeScript:** Para maior segurança e tipagem no código.
* **TailwindCSS:** Framework de estilização utilitário.
* **Nginx:** Servidor web e Proxy Reverso (no Docker).

### Backend
* **Python 3.11:** Linguagem base.
* **FastAPI:** Framework web moderno e rápido.
* **PyTorch:** Biblioteca de aprendizado de máquina.
* **Real-ESRGAN:** Modelo de I.A. para super-resolução de imagens.
* **OpenCV:** Processamento de imagem.

---

## 🐳 Como Rodar com Docker (Recomendado)

Esta é a maneira mais fácil de rodar o projeto, garantindo que todas as dependências de sistema e bibliotecas de I.A. estejam corretas.

### Pré-requisitos
* [Docker](https://docs.docker.com/get-docker/) e **Docker Compose** instalados na máquina.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/image-resolution-enchancement-tool.git](https://github.com/seu-usuario/image-resolution-enchancement-tool.git)
    cd image-resolution-enchancement-tool
    ```

2.  **Construa e Inicie a Aplicação:**
    Execute o comando abaixo na raiz do projeto:
    ```bash
    sudo docker compose up -d --build
    ```
    *Nota: O primeiro build pode levar alguns minutos, pois o Docker baixará as bibliotecas de I.A. (PyTorch) e configurará o ambiente Linux.*

3.  **Acesse o Sistema:**
    * Abra seu navegador em: [http://localhost:5173](http://localhost:5173)

4.  **Para Parar:**
    ```bash
    sudo docker compose down
    ```

---

## 🔧 Instalação Manual (Sem Docker)

Caso prefira rodar localmente em seu ambiente de desenvolvimento (requer Python 3.11+ e Node.js instalados).

### Backend
1.  Entre na pasta do backend: `cd backend`
2.  Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```
3.  Inicie o servidor:
    ```bash
    uvicorn app:app --reload --port 8000
    ```

### Frontend
1.  Entre na pasta do frontend: `cd frontend`
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

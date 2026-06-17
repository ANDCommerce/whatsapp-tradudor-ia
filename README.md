## 🚀 Como instalar a extensão no Chrome (Modo Desenvolvedor)

Como esta extensão ainda não está disponível na Chrome Web Store, você precisa instalá-la manualmente usando o **Modo do Desenvolvedor**. Siga o passo a passo abaixo:

### 1º Baixe este repositório

Clique no botão verde **Code** no topo desta página e selecione **Download ZIP**, ou clone via terminal:

```bash
git clone https://github.com/ANDCommerce/whatsapp-tradudor-ia.git
```
<img width="484" height="415" alt="image" src="https://github.com/user-attachments/assets/54f2fc36-e98f-4683-9caf-679a88a85153" />

Depois, **descompacte a pasta** (caso tenha baixado o ZIP) em um local de fácil acesso no seu computador.

### 2º Acesse a URL `chrome://extensions/`

Abra uma nova aba no Google Chrome e digite (ou copie e cole) o seguinte endereço na barra de URL:

```
chrome://extensions/
```

### 3º Ative o "Modo do desenvolvedor"

No canto superior direito da página, você verá uma chave de ativação chamada **"Modo do desenvolvedor"**. Clique para ativá-la.

### 4º Clique em "Carregar sem compactação"

Com o Modo do Desenvolvedor ativado, novos botões aparecerão no topo da página. Clique em **"Carregar sem compactação"** (em inglês, *"Load unpacked"*).

### 5º Selecione a pasta da extensão

Uma janela do explorador de arquivos será aberta. Navegue até a pasta onde você salvou/descompactou o repositório e clique em **Selecionar pasta**.

> ⚠️ **Atenção:** selecione a pasta raiz do projeto (onde está o arquivo `manifest.json`), e não um arquivo específico.

### 6º Pronto! 🎉

A extensão será instalada e aparecerá na sua lista de extensões, já habilitada. Você também pode visualizar o ícone dela clicando no ícone de **quebra-cabeça (🧩)** na barra de ferramentas do Chrome.

### 7º (Opcional) Fixe o ícone na barra de ferramentas

Para facilitar o acesso, clique no ícone de quebra-cabeça (🧩) ao lado da barra de endereço e depois no ícone de **pin/alfinete** ao lado do nome da extensão.

---

### ❓ Problemas comuns

- **Erro "Manifest file is missing or unreadable"**: verifique se você selecionou a pasta correta, que deve conter o arquivo `manifest.json` na raiz.
- **A extensão não aparece**: recarregue a página `chrome://extensions/` ou reinicie o navegador.
- **Após atualizar o código**: volte em `chrome://extensions/` e clique no ícone de **recarregar (🔄)** no card da extensão para aplicar as mudanças.

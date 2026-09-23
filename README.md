# 🗂️ @robert.tools/curl

Provide an easy to use curl function

## 📜 Usage

### 🟢 Installation

```bash
npm install @robert.tools/curl
```

### 📝 Sample usage

```typescript
import { curl } from '@robert.tools/curl';

curl('www.robert.tools', { silent: true }); // 'curl: robert.tools'
```

## 🗃️ commands

After an npm install with `npm i` the following commands are available:

- execute curl command: `curl(url, options)`
- get curl data option: `getCurlData(request)`

## ⚖️ Notes

This software is hand-crafted, test-driven and assisted by AI tools. I know each line of my code. ✌️

| Tool  | Comment |
 | ------------- | ------------- |
| <img src="https://img.shields.io/badge/Jest-TDD-008800?logo=jest" alt="assisted by Jest" />  | Test-driven development with Jest |
| <img src="https://img.shields.io/badge/robert.tools-ecosystem-008800" alt="assisted by robert.tools" />  | Part of the robert.tools ecosystem |
| <img src="https://img.shields.io/badge/GitHub_Copilot-assisted-8A2BE2?logo=githubcopilot" alt="assisted by GitHub Copilot" />   | Code completion |
| <img src="https://img.shields.io/badge/OpenAI-assisted-8A2BE2?logo=openaigym" alt="assisted by OpenAI" />  | chatGPT research |
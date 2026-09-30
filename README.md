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
- check if timeout is defined: `hasTimeout(curl)`

## ⚖️ Notes

This software is hand-crafted, test-driven and assisted by AI tools. I know each
line of my code. ✌️

| Tool | Comment |
| --- | --- |
| ![assisted by Jest](https://img.shields.io/badge/Jest-TDD-008800?logo=jest) | Test-driven development with Jest |
| ![assisted by robert.tools](https://img.shields.io/badge/robert.tools-ecosystem-008800) | Part of the robert.tools ecosystem |
| ![assisted by GitHub Copilot](https://img.shields.io/badge/GitHub_Copilot-assisted-8A2BE2?logo=githubcopilot) | Code completion |
| ![assisted by OpenAI](https://img.shields.io/badge/OpenAI-assisted-8A2BE2?logo=openai) | chatGPT research |

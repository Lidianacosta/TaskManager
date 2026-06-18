---
name: 🛠️ Manutenção e Refatoração
about: Tarefas técnicas de arquitetura, segurança ou atualização de ambiente.
title: '[TECH] - Resumo da manutenção'
labels: refactor, dependencies
assignees: ''
---

### Tipo de Manutenção
- [ ] Preventiva (Refatoração de código, melhoria de performance, otimização de queries)
- [ ] Adaptativa (Atualização do Django/DRF, mudança de versão do Python, migração de banco)

### Descrição da Tarefa
Explique o que precisa ser atualizado ou refatorado no back-end. Exemplo: "O arquivo views.py está muito complexo, precisamos extrair a lógica de validação para os serializers."

### Impacto Esperado
O que essa mudança afeta? Há risco de quebrar alguma rota da API?

### Critérios de Aceitação
- [ ] Os testes automatizados (CI) devem continuar passando.
- [ ] A performance não deve ser degradada.
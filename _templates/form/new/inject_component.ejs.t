---
to: src/libs/common/components/form/index.ts
inject: true
append: true
---
export * from './<%= h.changeCase.kebabCase(name) %>';
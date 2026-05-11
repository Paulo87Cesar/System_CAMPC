import { cpf, cnpj } from 'cpf-cnpj-validator';
import { z } from 'zod';

// Mathematical validation helpers
export const isValidCpf = (value: string) => cpf.isValid(value);
export const isValidCnpj = (value: string) => cnpj.isValid(value);

// Zod Schemas for data validation
export const InscricaoSchema = z.object({
  nome_completo: z.string().min(3, "Nome muito curto"),
  cpf: z.string().refine((val) => isValidCpf(val), { message: "CPF inválido" }),
  rg: z.string().min(8, "RG muito curto").optional().or(z.literal('')),
  email: z.string().email("E-mail inválido").optional().or(z.literal('')),
  end_cep: z.string().length(9, "CEP deve ter 8 dígitos").optional().or(z.literal('')),
});

export const EmpresaSchema = z.object({
  razao_social: z.string().min(3, "Razão social obrigatória"),
  cnpj: z.string().refine((val) => isValidCnpj(val), { message: "CNPJ inválido" }),
  email: z.string().email("E-mail inválido").optional().or(z.literal('')),
});

export const JovemSchema = z.object({
  nome_completo: z.string().min(3, "Nome obrigatório"),
  cpf: z.string().refine((val) => isValidCpf(val), { message: "CPF inválido" }),
  rg: z.string().min(8, "RG muito curto").optional().or(z.literal('')),
  email: z.string().email("E-mail inválido").optional().or(z.literal('')),
});

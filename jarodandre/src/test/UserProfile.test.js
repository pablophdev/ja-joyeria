import { describe, expect,it } from "vitest";
import {normalizeUserProfile} from "../utilidades/userValidation"

describe("normalizeUserProfile", () =>{
    it("acepta un registro valido y limpia los datos", () => {
        const result = normalizeUserProfile({
            name: "Ana Perez",
            email: "ANA@GMAIL.COM",
            rut: "12345678-5",
            phone: "912345678",
            region: "RM",
            commune: "Santiago",
        })

        expect(result).toEqual({
            name: "Ana Perez",
            email: "ana@gmail.com",
            rut: "12345678-5",
            phone: "912345678",
            region: "RM",
            commune: "Santiago",
        })
    })

    it("rechaza un correo fuera de los dominios admitidos", () => {
        expect(()=> normalizeUserProfile({
            name: "Ana Perez", email: "ana@yahoo.com", rut: "12345678-5",
            phone: "", region: "RM", commune: "Santiago",
        })).toThrow()
    })

    it('rechaza un RUT con dígito verificador incorrecto', () => {
    expect(() => normalizeUserProfile({
            name: 'Ana Pérez', email: 'ana@gmail.com', rut: '12.345.678-9',
            phone: '', region: 'RM', commune: 'Santiago',
        })).toThrow()
    })


    it('rechaza una comuna que no pertenece a la región elegida', () => {
    expect(() => normalizeUserProfile({
            name: 'Ana Pérez', email: 'ana@gmail.com', rut: '12345678-5',
            phone: '', region: 'RM', commune: 'Temuco',
        })).toThrow()
    })


    it('rechaza entradas que no son un objeto', () => {
    expect(() => normalizeUserProfile(null)).toThrow()
    expect(() => normalizeUserProfile(undefined)).toThrow()
    })
})
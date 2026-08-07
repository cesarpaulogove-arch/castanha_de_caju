'use client'
// 1. IMPORTAMOS O INITIALIZEAPP DO FIREBASE BASE
import { initializeApp, getApps, getApp } from 'firebase/app'

// 2. ADICIONAMOS MANUALMENTE OS PRODUTOS QUE FALTAVAM NO SEU CÓDIGO DA CONSOLA
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// As tuas credenciais reais geradas pela consola do teu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_r95D0U2zW7OfNk2OwQv9s5_Q2pnOYN4",
  authDomain: "sidcode-castanhas.firebaseapp.com",
  databaseURL: "https://sidcode-castanhas-default-rtdb.firebaseio.com",
  projectId: "sidcode-castanhas",
  storageBucket: "sidcode-castanhas.firebasestorage.app",
  messagingSenderId: "33130733698",
  appId: "1:33130733698:web:e0281f8ff13261a171d49b",
  measurementId: "G-HC7G3FMNJN"
}

// Inicialização segura para evitar conflitos no Next.js durante o Hot Reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// 3. CRIAMOS E EXPORTAMOS AS DUAS VARIÁVEIS QUE O SEU CARRINHO E AUTHCONTEXT PRECISAM
export const auth = getAuth(app)
export const db = getFirestore(app)

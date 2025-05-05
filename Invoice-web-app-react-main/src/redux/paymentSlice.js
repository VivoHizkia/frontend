import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payments: [], // daftar semua transaksi pembayaran
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    // Menambahkan pembayaran baru ke dalam state
    addPayment: (state, action) => {
      state.payments.push(action.payload);
    },

    // Menghapus pembayaran berdasarkan ID
    deletePayment: (state, action) => {
      state.payments = state.payments.filter(p => p.id !== action.payload.id);
    },

    // Memperbarui pembayaran berdasarkan ID
    updatePayment: (state, action) => {
      const index = state.payments.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },

    // Memperbarui status pembayaran berdasarkan ID
    updatePaymentStatus: (state, action) => {
      const { id, isVoid } = action.payload;
      const payment = state.payments.find((p) => p.id === id);
      if (payment) {
        payment.isVoid = isVoid;
      }
    },
  },
});

// Mengekspor action yang digunakan di komponen untuk dispatch
export const { addPayment, deletePayment, updatePayment, updatePaymentStatus } = paymentSlice.actions;

// Mengekspor reducer untuk digunakan di store.js
export default paymentSlice.reducer;

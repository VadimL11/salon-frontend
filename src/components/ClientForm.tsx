"use client";

import styles from './ClientForm.module.css';
import React, { useState } from 'react';

interface Client {
  id?: number;
  name: string;
  email: string;
  phone: string;
}

interface ClientFormProps {
  initialData?: Client;
  onSave: (client: Client) => void;
  onCancel: () => void;
}

export default function ClientForm({ initialData, onSave, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState<Client>(initialData || { name: '', email: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 style={{ marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>
          {initialData ? 'Edit Client' : 'Add New Client'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="client-name" className={styles.label}>Full Name</label>
            <input
              id="client-name"
              type="text"
              className={styles.input}
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="client-email" className={styles.label}>Email Address</label>
            <input
              id="client-email"
              type="email"
              className={styles.input}
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="client-phone" className={styles.label}>Phone Number</label>
            <input
              id="client-phone"
              type="tel"
              className={styles.input}
              value={formData.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onCancel}>Cancel</button>
            <button type="submit" className={styles.save}>Save Client</button>
          </div>
        </form>
      </div>
    </div>
  );
}

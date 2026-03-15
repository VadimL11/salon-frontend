"use client";

import Navbar from '@/components/Navbar';
import ClientForm from '@/components/ClientForm';
import styles from './Clients.module.css';
import React, { useState } from 'react';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '234-567-8901' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '345-678-9012' },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);

  const handleSave = (clientData: Omit<Client, 'id'>) => {
    if (editingClient) {
      setClients(clients.map((c: Client) => c.id === editingClient.id ? { ...clientData, id: c.id } : (c as Client)));
    } else {
      const newClient: Client = { ...clientData, id: Date.now() };
      setClients([...clients, newClient]);
    }
    setIsFormOpen(false);
    setEditingClient(undefined);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter((c: Client) => c.id !== id));
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.header}>
          <h1>Client Management</h1>
          <button className={styles.addButton} onClick={() => { setEditingClient(undefined); setIsFormOpen(true); }}>
            Add New Client
          </button>
        </div>
        
        {isFormOpen && (
          <ClientForm 
            initialData={editingClient} 
            onSave={handleSave} 
            onCancel={() => setIsFormOpen(false)} 
          />
        )}

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client: Client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>
                  <button 
                    onClick={() => handleEdit(client)}
                    style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer', marginRight: '10px', fontWeight: '600' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(client.id)}
                    style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}

